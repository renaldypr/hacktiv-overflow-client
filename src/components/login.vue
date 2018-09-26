<template>
  <div class="modal fade" id="loginModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Login</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="alert alert-danger" role="alert" v-if="errorMsg">
          <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>
          {{ errorMsg }}</div>
          <div class="alert alert-success" role="alert" v-if="successMsg">
          <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>
          {{ successMsg }}</div>
          <div class="form-group">
            <input id="email" type="email" class="form-control" placeholder="Email" required="required" v-model="emailLogin">
          </div>
          <div class="form-group">
            <input id="password" type="password" class="form-control" placeholder="Password" required="required" v-model="passwordLogin">
          </div>
          <div class="form-group">
            <button type="button" class="btn btn-primary btn-block" v-on:click="login()">Log in</button>
          </div>
          <fb-signin-button
            :params="fbSignInParams"
            @success="onSignInSuccess"
            @error="onSignInError">
            Sign in with Facebook
          </fb-signin-button>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
let url = 'http://localhost:3000'

export default {
  data() {
    return {
      emailLogin: '',
      passwordLogin: '',
      errorMsg: '',
      successMsg: '',
      fbSignInParams: {
        scope: 'email,user_likes',
        return_scopes: true
      }
    }
  },
  methods: {
    login: function() {
      if(this.emailLogin === '' || this.passwordLogin === '') {
        this.errorMsg = 'please insert your email & password!'
      } else {
        let self = this;
        axios({
          method: 'post',
          url: `${url}/users/login`,
          data: {
            email: this.emailLogin,
            password: this.passwordLogin
          }
        })
          .then(data => {
            self.emailLogin = ''
            self.passwordLogin = ''
            self.successMsg = 'Login success!'
  
            localStorage.setItem('email', data.data.email)
            localStorage.setItem('user', data.data.user)
            localStorage.setItem('token', data.data.token)
  
            this.$store.dispatch('changeLoginStatus')
          })
          .catch(err => {
            this.errorMsg = err.response.data.message
          })
      }
    },
    onSignInSuccess (response) {
      axios({
          method: 'post',
          url: `${url}/users/loginFB`,
          headers: {
            tokenfb: response.authResponse.accessToken
          }
        })
          .then(data => {
            self.emailLogin = ''
            self.passwordLogin = ''
            self.successMsg = 'Login success!'
  
            localStorage.setItem('email', data.data.email)
            localStorage.setItem('user', data.data.user)
            localStorage.setItem('token', data.data.token_jwt)
  
            this.$store.dispatch('changeLoginStatus')
          })
          .catch(err => {
            this.errorMsg = err.response.data.message
          })   
    },
    onSignInError (error) {
      this.errorMsg = error
    }
  }
}
</script>

<style scoped>
.btn-primary {
  background-color: #15441e;
}
.fb-signin-button {
  /* This is where you control how the button looks. Be creative! */
  display: inline-block;
  padding: 4px 8px;
  border-radius: 3px;
  background-color: #4267b2;
  color: #fff;
}
</style>
