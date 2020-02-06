const express = require('express')
const router = express.Router()
const { validation, schema } = require('../validator/users')
const db = require('../config/db')

router.route('/users?')
    .get((req, res, next) => {
        let sql = ' SELECT * FROM tbl_users ORDER BY id DESC'
        db.query(sql, (error, results, fields) => {
            if (error) return res.status(500).json({
                "status": 500,
                "message": "Internal Server Error" // error.sqlMessage
            })
            return res.json(results)
        })
    })
    .post(validation(schema), (req, res, next) => {
        let user = {
            "name": req.body.name,
            "email": req.body.email
        }
        let sql = ' INSERT INTO tbl_users SET ? '
        db.query(sql, user, (error, results, fields) => {
            if (error) return res.status(500).json({
                "status": 500,
                "message": "Internal Server Error" // error.sqlMessage
            })
            //response data from new "id"
            result = [{ 'id': results.insertId, ...user }]
            return res.json(result)
        })
    })

router.route('/user/:id')
    .all((req, res, next) => {
        //check id in database
        let sql = ' SELECT * FROM tbl_users WHERE id = ? '
        db.query(sql, [req.params.id], (error, results, fields) => {
            if (error) return res.status(500).json({
                "status": 500,
                "message": "Internal Server Error" // error.sqlMessage
            })
            if (results.length === 0) return res.status(400).json({
                "status": 400,
                "message": "Not found user with the given ID"
            })
            res.user = results  //set user and next process
            next()
        })
    })
    .get((req, res, next) => {
        return res.json(res.user)
    })
    .put(validation(schema), (req, res, next) => {
        let user = {
            "name": req.body.name,
            "email": req.body.email
        }
        let sql = ' UPDATE tbl_users SET ? WHERE id = ? '
        db.query(sql, [user, req.params.id], (error, results, fields) => {
            if (error) return res.status(500).json({
                "status": 500,
                "message": "Internal Server Error" // error.sqlMessage
            })
            if (results.affectedRows > 0) {
                // update database from all form data
                user = Object.assign(res.user[0], user)
            } else { //update but same value
                user = res.user
            }

            const result = {
                "status": 200,
                "data": user
            }
            return res.json(result)
        })
    })
    .delete((req, res, next) => {
        let sql = ' DELETE FROM tbl_users WHERE id = ? '
        db.query(sql, [req.params.id], (error, results, fields) => {
            if (error) return res.status(500).json({
                "status": 500,
                "message": "Internal Server Error" // error.sqlMessage
            })

            const result = {
                "status": 200,
                "data": res.user
            }
            return res.json(result)
        })
    })

module.exports = router