<template>
  <div>
    <div v-if="errMessage" class="alert alert-danger alert-dismissible fade show mt-3" role="alert">
      {{ errMessage }}
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="row border-bottom pb-3 pt-3 text-light">
      <div class="col-md-1">
        <i class="fas fa-arrow-alt-circle-up" :class="upvoteColor" v-on:click="upvote"></i>
        <p class="m-0" style="font-size: 20px;">{{ voteTotal }}</p>
        <i class="fas fa-arrow-alt-circle-down" :class="downvoteColor" v-on:click="downvote"></i>
      </div>
      <div class="col-md-11 text-left">
        <div id="answerAuthor" class="text-left mb-3 row">
          <div class="col-md-0 ml-3">
            <img id="authorImage" class="rounded-circle" src="https://via.placeholder.com/40x40">
          </div>
          <div class="col-md-3">
            <p class="author mb-0 ">{{ answerData.userId.name }}</p>
            <p class="text-light">Answered {{ convertDate(answerData.createdAt) }}</p>
          </div>
        </div>
        <div v-if="!editAnswer && ownAnswer" class="dropdown">
          <i class="fas fa-ellipsis-v float-right text-light" style="font-size: 20px;" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></i>
          <div class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton">
            <a class="dropdown-item" v-on:click="triggerUpdateAnswer">Update Answer</a>
          </div>
        </div>
        <p v-if="!editAnswer">{{ answerData.content }}</p>
        <div v-else class="form-group pt-4 text-left">
          <textarea class="form-control mb-3 w-50" rows="5" id="answerInput" v-model="answerData.content"></textarea>
          <button v-on:click="updateAnswer" type="button" class="btn text-light">Submit</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

let url = 'http://localhost:3000'

export default {
  props: [ 'answerData', 'questionId' ],
  data() {
    return {
      voteTotal: '',
      upvoteColor: '',
      downvoteColor: '',
      editAnswer: false,
      errMessage: ''
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
      
      for (let i = 0; i < this.answerData.votes.length; i++) {
        if (this.answerData.votes[i].vote) {
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
      url: `${url}/answers/${this.answerData._id}/upvote`,
      headers: {
        token: localStorage.getItem('token')
      }
      })
        .then(result => {
          this.$emit('refresh-data')
          console.log(result.data)
          if (result.data.message === 'answer voted successfully!') {
            this.upvoteColor = 'upvoted'
          } else if (result.data.message === 'answer\'s vote updated successfully!') {
            this.upvoteColor = 'upvoted'
            this.downvoteColor = ''
          } else {
            this.upvoteColor = ''
          }
        })
        .catch(err => {
          if (err.response.data.message.name) {
            this.errMessage = 'Please login to vote!'
          } else {
            this.errMessage = err.response.data.message
          }
        })
    },
    downvote: function() {
      axios({
      method: 'post',
      url: `${url}/answers/${this.answerData._id}/downvote`,
      headers: {
        token: localStorage.getItem('token')
      }
      })
        .then(result => {
          this.$emit('refresh-data')
          if (result.data.message === 'answer voted successfully!') {
            this.downvoteColor = 'downvoted'
          } else if (result.data.message === 'answer\'s vote updated successfully!') {
            this.upvoteColor = ''
            this.downvoteColor = 'downvoted'
          } else {
            this.downvoteColor = ''
          }
        })
        .catch(err => {
          if (err.response.data.message.name) {
            this.errMessage = 'Please login to vote!'
          } else {
            this.errMessage = err.response.data.message
          }
        })
    },
    triggerUpdateAnswer: function() {
      this.editAnswer = true
    },
    updateAnswer: function() {
      axios({
        method: 'patch',
        url: `${url}/answers`,
        headers: {
          token: localStorage.getItem('token')
        },
        data: {
          id: this.answerData._id,
          content: this.answerData.content
        }
      })
        .then(question => {
          this.editAnswer = false
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  created() {
    this.voteCount()
  },
  computed: {
    isLogin() {
      return this.$store.state.isLogin
    },
    ownAnswer() {
      if (this.isLogin) {
        if (localStorage.getItem('email') === this.answerData.userId.email) {
          return true
        } else {
          return false
        }
      } else {
        return false
      }
    }
  },
  watch: {
    answerData: function() {
      this.voteCount()
    }
  }
}
</script>

<style scoped>
.author {
  display: inline-block;
}
#answerAuthor {
  font-size: 14px;
}
i, .dropdown-item {
  cursor: pointer;
}
.upvoted {
  color: #4e6eff;
}
.downvoted {
  color: rgb(238, 80, 80);
}
</style>
