<template>
  <div class="card mb-3">
        <div class="card-body pb-0">
            <div class="row">
                <div class="col-md-1">
                  <p class="mb-2">{{ voteTotal }}</p>
                  <p class="pt-1">Votes</p>
                </div>
                <div class="col-md-1">
                  <p class="mb-2">{{ questionData.answers.length }}</p>
                  <p class="pt-1">Answers</p>
                </div>
                <div class="col-md-10 text-left">
                  <h4><router-link :to="{ name: 'details', params: { id: questionData._id } }">{{ questionData.title }}</router-link></h4>
                  <p>{{ questionData.userId.name }} | {{ convertDate(questionData.createdAt) }} </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  props: [ 'questionData' ],
  data() {
    return {
      voteTotal: 0
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
      
      for (let i = 0; i < this.questionData.votes.length; i++) {
        if (this.questionData.votes[i].vote) {
          upvote++
        } else {
          downvote++
        }
      }
      this.voteTotal = upvote - downvote
    }
  },
  created() {
    this.voteCount()
  }
}
</script>

<style scoped>
.card {
  background: #c5c6c7;
}
p, h4, a {
  color: #0b0c10;
}
</style>
