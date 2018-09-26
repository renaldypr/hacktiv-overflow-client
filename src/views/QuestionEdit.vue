<template>
  <div id="form">
    <h1 class="text-light mt-4">Update Question</h1>
    <div class="card mt-4 mb-4 w-75 mx-auto">
      <div class="card-body">
        <div class="form-group">
          <input id="title" type="text" class="form-control" required="required" v-model="titleEdit">
        </div>
        <div class="form-group">
          <textarea v-model="contentEdit" class="form-control" rows="6" id="content"></textarea>
        </div>
        <div class="form-group">
          <button type="button" class="btn btn-block text-light" v-on:click="updateQuestion()">Update Question</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

let url = 'http://localhost:3000'

export default {
  props: [ 'id' ],
  data() {
    return {
      titleEdit: '',
      contentEdit: ''
    }
  },
  methods: {
    updateQuestion() {
      axios({
        method: 'patch',
        url: `${url}/questions`,
        headers: {
          token: localStorage.getItem('token')
        },
        data: {
          id: this.id,
          title: this.titleEdit,
          content: this.contentEdit
        }
      })
        .then(question => {
          this.$router.push(`/questions/${this.id}`)
        })
        .catch(err => {
          console.log(err)
        })
      }
  },
  created() {
    axios({
      method: 'get',
      url: `${url}/questions/${this.id}`
    })
      .then(question => {
        this.titleEdit = question.data.data.title
        this.contentEdit = question.data.data.content
      })
      .catch(err => {
        console.log(err)
      })
  }
}
</script>

<style scoped>
#form {
  height: auto;
  min-height: 100vh;
}
.card {
  background: #c5c6c7;
}
</style>
