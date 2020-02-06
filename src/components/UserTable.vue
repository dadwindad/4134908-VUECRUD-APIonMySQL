<template>
  <div>
    <table class="table table-hover">
      <thead>
        <tr>
          <th>ID</th>
          <th>USER</th>
          <th>Email</th>
          <th></th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(user, index) in users" v-bind:key="index">
          <td>{{user.id}}</td>
          <td>{{user.name}}</td>
          <td>{{user.email}}</td>
          <td>
            <b-link @click="edit(user.id)">
              <b-icon icon="pencil"></b-icon>
            </b-link>
          </td>
          <td>
            <b-link @click="del(user.id)">
              <b-icon icon="trash"></b-icon>
            </b-link>
          </td>
        </tr>
      </tbody>
    </table>

    <modalEdit ref="modalEdit" />
  </div>
</template>

<script>
import axios from "axios";
import modalEdit from "@/components/ModalEdit.vue";

export default {
  name: "userTable",
  components: {
    modalEdit
  },
  data() {
    return {
      users: []
    };
  },
  methods: {
    del(id) {
      this.$bvModal
        .msgBoxConfirm(`DELETE ID : ${id}`, {
          title: "Confirmation"
        })
        .then(value => {
          if (value) {
            axios.delete(`http://127.0.0.1:3000/api/user/${id}`);
            //update table
            this.users = this.users.filter(user => user.id != id);
            //this.$refs.showAlert.showAlert();
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    edit(id) {
      this.$refs.modalEdit.showModalEdit(id);
    }
  },
  mounted() {
    axios
      .get("http://127.0.0.1:3000/api/user")
      .then(response => (this.users = response.data));
  }
};
</script>