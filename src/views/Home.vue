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
      <!-- <v-col
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
      </v-col> -->
      <v-col
        cols="10"
        class="d-flex flex-row align-center"
      >
        <v-img
          class="rounded-circle elevation-4 d-inline-block"
          :src="avatarURL"
          width="54"
          height="54"
          max-width="54"
        />
        <div class="ml-4">
          {{ welcomeTag }}
          <br>
          <small>
            {{ userData.fullName }}
          </small>
        </div>
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
    <v-row class="mt-4 justify-center">
      <v-card
        class="mx-3"
        width="300"
        outlined
      >
        <v-list-item three-line>
          <v-list-item-content>
            <div class="text-overline mb-4">
              SALDO
            </div>
            <v-list-item-title class="text-h2 mb-1">
              {{ saldoFormat }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-card-actions>
          <v-btn
            class="d-flex align-center"
            color="primary"
            outlined
            @click="dialogTopup = true"
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
    <!-- Dialog Topup -->
    <v-dialog
      v-model="dialogTopup"
      width="400"
    >
      <card-topup @callback="topupCb" />
    </v-dialog>
  </v-container>
</template>
<script>
  import axios from 'axios'
  import CardTopup from '../components/CardTopup.vue'
  export default {
    name: 'HomeView',
    components: {
      'card-topup': CardTopup,
    },
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
      dialogTopup: false,
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
      saldoFormat: function () {
        if (this.userData.saldo !== null) {
          return 'Rp ' + this.userData.saldo.toFixed(0).replace(/./g, function (c, i, a) {
            return i > 0 && c !== '.' && (a.length - i) % 3 === 0 ? ',' + c : c
          })
        } else {
          return 'Rp 0'
        }
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
            localStorage.setItem('userData', JSON.stringify(self.userData))
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
      topupCb (cb) {
        if (cb.cancel) {
          this.dialogTopup = false
        } else if (cb.submit) {
          this.dialogTopup = false
          this.initialize()
        }
      },
    },
  }
</script>
