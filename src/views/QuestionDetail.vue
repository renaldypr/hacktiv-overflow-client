<template>
  <div class="container">
    <div v-if="errMessage" class="alert alert-danger alert-dismissible fade show mt-3" role="alert">
      {{ errMessage }}
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <h3 class="text-left mt-4 text-light">{{ question.title }}</h3>
    <div class="row border-top pb-3 pt-3 text-light">
      <div class="col-md-1">
        <i class="fas fa-arrow-alt-circle-up" :class="upvoteColor" v-on:click="upvote"></i>
        <p class="m-0" style="font-size: 20px;">{{ voteTotal }}</p>
        <i class="fas fa-arrow-alt-circle-down" :class="downvoteColor" v-on:click="downvote"></i>
      </div>
      <div class="col-md-11 text-left">
        <p>{{ question.content }}</p>
        <div class="text-right mb-3" id="authorDiv">
          <p class="mb-0">Asked by:</p>
          <img id="authorImage" class="rounded-circle mr-2" src="https://via.placeholder.com/40x40">
          <p class="author ml-2">{{ question.userId.name }} | {{ convertDate(question.createdAt) }}</p>
        </div>
      </div>
      <div v-if="ownQuestion" class="btn-group pt-2 ml-3 mt-0 mb-3">
        <button class="btn text-light btn-sm dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          Question Tools
        </button>
        <div class="dropdown-menu dropdown-menu-left">
          <a class="dropdown-item"><router-link class="text-dark" style="text-decoration: none;" :to="{ name: 'edit', params: { id: id } }">Update Question</router-link></a>
          <div class="dropdown-divider"></div>
          <a class="dropdown-item" v-on:click="deleteQuestion" style="cursor: pointer;">Delete Question</a>
        </div>
      </div>
    </div>
    <h4 class="text-left text-light pb-2 border-bottom">Your Answer</h4>
    <div v-if="isLogin" class="form-group pt-3 mb-5 text-left">
      <textarea v-model="answerInput" class="form-control mb-3 w-50" rows="5" id="answerInput" placeholder="Post an answer"></textarea>
      <button v-on:click="postAnswer" type="button" class="btn text-light">Submit</button>
    </div>
    <p class="mt-3 mb-5 text-light text-left" v-if="!isLogin">Please <a class="text-light" href="#" data-toggle="modal" data-target="#loginModal">login</a> to post an answer</p>
    <h4 v-if="question.answers.length !== 0" class="text-left text-light border-bottom pb-2">{{ question.answers.length }} Answers</h4>
    <Answer v-bind:questionId="id" v-on:refresh-data="refreshData" v-for="(answer,index) in question.answers" :key="index" v-bind:answerData="answer"></Answer>
  </div>
</template>

<script>
import Answer from '@/components/answer.vue'
import axios from 'axios'

let url = 'http://localhost:3000'

export default {
  props: [ 'id' ],
  components: {
    Answer
  },
  data() {
    return {
      question: '',
      voteTotal: '',
      upvoteColor: '',
      downvoteColor: '',
      answerInput: '',
    }
  },
  methods: {
    convertDate: function (date) {
      let newFormat = String(new Date(date)).split(' ').slice(1, 4).join(' ')
      return newFormat
    },
    voteCount: function() {
      let upvote = 0
      let downvote = 0
      
      for (let i = 0; i < this.question.votes.length; i++) {
        if (this.question.votes[i].vote) {
          upvote++
        } else {
          downvote++
        }
      }
      this.voteTotal = upvote - downvote
    },
    upvote: function() {
      axios({
        method: 'post',
        url: `${url}/questions/${this.question._id}/upvote`,
        headers: {
          token: localStorage.getItem('token')
        }
      })
        .then(result => {
          this.refreshData()
          if (result.data.message === 'question voted successfully!') {
            this.upvoteColor = 'upvoted'
          } else if (result.data.message === 'question\'s vote updated successfully!') {
            this.upvoteColor = 'upvoted'
            this.downvoteColor = ''
          } else {
            this.upvoteColor = ''
          }
        })
        .catch(err => {
          if (err.response.data.message.name) {
            this.$store.dispatch('sendErrMessage', 'Please login to vote!')
          } else {
            this.$store.dispatch('sendErrMessage', err.response.data.message)
          }
        })
    },
    downvote: function() {
      axios({
        method: 'post',
        url: `${url}/questions/${this.question._id}/downvote`,
        headers: {
          token: localStorage.getItem('token')
        }
      })
        .then(result => {
          this.refreshData()
          if (result.data.message === 'question voted successfully!') {
            this.downvoteColor = 'downvoted'
          } else if (result.data.message === 'question\'s vote updated successfully!') {
            this.upvoteColor = ''
            this.downvoteColor = 'downvoted'
          } else {
            this.downvoteColor = ''
          }
        })
        .catch(err => {
          if (err.response.data.message.name) {
            this.$store.dispatch('sendErrMessage', 'Please login to vote!')
          } else {
            this.$store.dispatch('sendErrMessage', err.response.data.message)
          }
        })
    },
    refreshData: function() {
      axios({
        method: 'get',
        url: `${url}/questions/${this.id}`
      })
        .then(question => {
          this.question = question.data.data
          this.voteCount()
        })
        .catch(err => {
          this.$store.dispatch('sendErrMessage', err.response.data.message)
        })
    },
    postAnswer: function() {
      axios({
        method: 'post',
        url: `${url}/answers`,
        headers: {
          token: localStorage.getItem('token')
        },
        data: {
          questionId: this.id,
          content: this.answerInput
        }
      })
        .then(result => {
          this.refreshData()
          this.answerInput = ''
        })
        .catch(err => {
          this.$store.dispatch('sendErrMessage', err.response.data.message)
        })
    },
    deleteQuestion: function() {
      axios({
        method: 'delete',
        url: `${url}/questions`,
        headers: {
          token: localStorage.getItem('token')
        },
        data: {
          id: this.id
        }
      })
        .then(result => {
          this.$router.push('/questions')
        })
        .catch(err => {
          this.$store.dispatch('sendErrMessage', err.response.data.message)
        })
    }
  },
  created() {
    axios({
      method: 'get',
      url: `${url}/questions/${this.id}`
    })
      .then(question => {
        this.question = question.data.data
        this.voteCount()
      })
      .catch(err => {
        this.$store.dispatch('sendErrMessage', err.response.data.message)
      })
  },
  computed: {
    isLogin() {
      return this.$store.state.isLogin
    },
    ownQuestion() {
      if (this.isLogin) {
        if (localStorage.getItem('email') === this.question.userId.email) {
          return true
        } else {
          return false
        }
      } else {
        return false
      }
    },
    errMessage() {
      return this.$store.state.errMessage
    }
  }
}
</script>

<style scoped>
#authorDiv {
  font-size: 14px;
}
.author {
  display: inline-block;
}
i {
  cursor: pointer;
}
.upvoted {
  color: #4e6eff;
}
.downvoted {
  color: rgb(238, 80, 80);
}
.dropdown-item {
  font-size: 14px;
}
.container {
  height: auto;
  min-height: 100vh;
}
</style>
