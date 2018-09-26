<template>
  <div class="container">
    <router-link class="text-light" :to="{ name: 'form' }"><button type="button" class="btn text-light btn-lg mt-3 mb-3">Ask Question</button></router-link>
    <Card v-for="(question, index) in questions" :key="index" v-bind:questionData="question"></Card>
  </div>
</template>

<script>
import Card from '@/components/card.vue'
import axios from 'axios'

let url = 'http://localhost:3000'

export default {
  components: {
    Card
  },
  data() {
    return {
      questions: []
    }
  },
  created() {
    axios({
      method: 'get',
      url: `${url}/questions`
    })
      .then(questions => {
        questions.data.data.forEach(question => {
          this.questions.push(question)
        })
      })
      .catch(err => {
        console.log(err)
      })
  }
}
</script>

<style scoped>
.container{
  height: auto;
  min-height: 100vh;
}
</style>
