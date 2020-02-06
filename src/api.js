const express = require('express')
const cors = require('cors');
const app = express()
const path = require('path')
const createError = require('http-errors')
const port = 3000
  
const userApi = require('./api/users')

app.use(cors());  
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))
  
app.use('/api', [userApi]) 
 
app.use(function(req, res, next) {
    var err = createError(404)
    next(err)
})
  
//error manager session
app.use(function (err, req, res, next) {
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}

    res.status(err.status || 500)
    res.render('error') 
})
  
app.listen(port, function() {
    console.log(`Example app listening on port ${port}!`)
})