<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbar1" aria-controls="navbar1"
      aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse justify-content-md-center" id="navbar1">
      <ul class="navbar-nav">
        <li class="nav-item">
          <router-link class="nav-link" to="/">Home</router-link>
        </li>
        <li v-if="!isUserLoggedIn" class="nav-item">
          <router-link class="nav-link" to="/login">Login</router-link>
        </li>
        <li v-if="!isUserLoggedIn" class="nav-item">
          <router-link class="nav-link" to="/register">Register</router-link>
        </li>
        <li v-if="isCustomer" class="nav-item">
          <router-link class="nav-link" to="/customerProfile">Profile</router-link>
        </li>
        <li v-if="isMasseur" class="nav-item">
          <router-link class="nav-link" :to="'/masseurProfile/' + this.currentUserId">Profile</router-link>
        </li>
        <li v-if="isUserLoggedIn" class="nav-item">
          <a class="nav-link" v-on:click="logout">Logout</a>
        </li>
        <li id="news-list-item">
          <NewsMainButton v-if="showNewsMainButton"/>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
import axios from 'axios'
import NewsMainButton from './news/NewsMainButton'

export default {
  components: {
    NewsMainButton
  },
  data () {
    return {
      isUserLoggedIn: false,
      isCustomer: false,
      isMasseur: false,

      currentUserId: '',

      showNewsMainButton: false
    }
  },
  methods: {
    logout() {
      if (this.$cookies.get('currentUser')) {
        axios.get('http://localhost:3000/users/logout', { withCredentials: true })
          .then(res => {
            if (!res.data.error) {
              console.log(res.data.description)
              this.$cookies.remove('currentUser')
              this.isUserLoggedIn = false
              this.isCustomer = false
              this.isMasseur = false
              if (this.$router.currentRoute.name != 'Home_view')
                this.$router.push({ name: 'Home_view' })
              else
                this.$router.go()
            } else {
              alert(res.data.error)
              console.log(res.data.error)
            }
          }).catch(err => {
            alert(err.response.data.error)
            console.log(err.response.data.error)
          })
      }
    },
    checkUserLogin() {
      if (this.$cookies.get('currentUser')) {
        this.isUserLoggedIn = this.$cookies.get('currentUser').logged_in
        if (this.isUserLoggedIn) {
          this.showNewsMainButton = true
        }
        this.currentUserId = this.$cookies.get('currentUser').user_id
        if (this.$cookies.get('currentUser').profile_type == "Customer"){
          this.isCustomer = true
          this.isMasseur = false
        }else{
          this.isCustomer = false
          this.isMasseur = true
        }
      }
    }
  },
  mounted () {
    this.checkUserLogin()
  }
}
</script>
