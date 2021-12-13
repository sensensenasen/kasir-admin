<template>
  <v-container
    id="home-view"
    fluid
    class="fill-height d-flex align-start"
    tag="section"
  >
    <v-row
      align="center"
    >
      <v-col
        cols="2"
      >
        <v-avatar
          color="primary"
          size="56"
        >
          <img
            :src="avatarURL"
          >
        </v-avatar>
      </v-col>
      <v-col
        cols="8"
        class="ml-2"
      >
        {{ welcomeTag }}
        <br>
        <small>
          {{ userData.fullName }}
        </small>
      </v-col>
      <v-col
        cols="1"
        class="text-aliign-center"
      >
        <v-badge
          :value="1"
          :content="1"
          color="primary"
          overlap
        >
          <v-icon>
            mdi-bell-outline
          </v-icon>
        </v-badge>
      </v-col>
    </v-row>
    <v-row class="mt-4">
      <v-card
        class="mx-auto"
        max-width="344"
        outlined
      >
        <v-list-item three-line>
          <v-list-item-content>
            <div class="text-overline mb-4">
              SALDO
            </div>
            <v-list-item-title class="text-h2 mb-1">
              Rp 1.500.000
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-card-actions>
          <v-btn
            class="d-flex align-center"
            color="primary"
            outlined
          >
            Top Up
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-row>
    <v-row class="mt-4">
      <v-card
        :loading="loading"
        class="mx-auto mb-12"
        max-width="374"
      >
        <template slot="progress">
          <v-progress-linear
            color="deep-purple"
            height="10"
            indeterminate
          />
        </template>

        <v-img
          height="250"
          src="https://cdn.vuetifyjs.com/images/cards/cooking.png"
        />

        <v-card-title>Cafe Badilico</v-card-title>

        <v-card-text>
          <v-row
            align="center"
            class="mx-0"
          >
            <v-rating
              :value="4.5"
              color="amber"
              dense
              half-increments
              readonly
              size="14"
            />

            <div class="grey--text ms-4">
              4.5 (413)
            </div>
          </v-row>

          <div class="my-4 text-subtitle-1">
            $ • Italian, Cafe
          </div>

          <div>Small plates, salads & sandwiches - an intimate setting with 12 indoor seats plus patio seating.</div>
        </v-card-text>

        <v-divider class="mx-4" />

        <v-card-title>Tonight's availability</v-card-title>

        <v-card-text>
          <v-chip-group
            v-model="selection"
            active-class="deep-purple accent-4 white--text"
            column
          >
            <v-chip>5:30PM</v-chip>

            <v-chip>7:30PM</v-chip>

            <v-chip>8:00PM</v-chip>

            <v-chip>9:00PM</v-chip>
          </v-chip-group>
        </v-card-text>

        <v-card-actions>
          <v-btn
            color="deep-purple lighten-2"
            text
          >
            Reserve
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-row>
  </v-container>
</template>
<script>
  import axios from 'axios'
  export default {
    name: 'HomeView',
    data: () => ({
      valid: true,
      loading: false,
      selection: 1,
      userData: {
        userName: '',
        email: '',
        userRole: '',
        doorKey: '',
        fullName: '',
        phone: '',
        gender: '',
        profileImage: '',
        bio: '',
        saldo: 0,
      },
      token: '',
    }),
    computed: {
      welcomeTag: function () {
        var today = new Date()
        var curHr = today.getHours()

        if (curHr < 12) {
          return 'Selamat Pagi'
        } else if (curHr < 18) {
          return 'Selamat Sore'
        } else {
          return 'Selamat Malam'
        }
      },
      avatarURL: function () {
        var url = process.env.VUE_APP_API_URL + 'uploads/blank-profile.jpg'
        if (this.userData.profileImage) {
          url = process.env.VUE_APP_API_URL + this.userData.profileImage
        }
        return url
      },
    },
    created () {
      this.initialize()
    },
    methods: {
      initialize () {
        var self = this
        self.token = localStorage.getItem('token')
        axios
          .get(process.env.VUE_APP_API_URL + 'users/token/' + self.token)
          .then((response) => {
            self.userData = response.data
            console.log(self.userData)
          })
          .catch((error) => console.log(error))
      },
      login () {
        var self = this
        var isEmail = self.name.includes('@')
        var loginObj = {}
        if (isEmail) {
          loginObj = {
            email: self.name,
            password: self.password,
          }
        } else {
          loginObj = {
            userName: self.name,
            password: self.password,
          }
        }

        axios
          .post(process.env.VUE_APP_API_URL + 'users/login', loginObj)
          .then((response) => {
            const { isAuth, token, userRole } = response.data
            localStorage.setItem('isAuth', isAuth)
            localStorage.setItem('token', token)
            localStorage.setItem('userRole', userRole)
            if (userRole === 'kasir') {
              self.$router.push({ path: '/' })
            } else if (userRole === 'user') {
              self.$router.push({ path: '/components/profile' })
            } else {
              self.$router.push({ path: '/components/profile' })
            }
          })
          .catch((error) => {
            if (error.response.data) {
              self.$toast.error(error.response.data, {
                type: 'error',
                position: 'top-right',
                duration: 3000,
                dismissible: true,
              })
            }
          })
      },
      reset () {
        this.$refs.form.reset()
      },
    },
  }
</script>
