<template>
  <v-container
    id="login-view"
    class="fill-height"
    fluid
    tag="section"
  >
    <v-row>
      <v-card
        class="mx-auto d-flex px-8 py-4"
        max-width="500"
      >
        <v-row>
          <v-col
            cols="12"
          >
            <h2 class="mb-2">
              Login
            </h2>
            <v-form
              ref="form"
              v-model="valid"
              lazy-validation
            >
              <v-text-field
                v-model="name"
                label="User Name/Email"
                :rules="nameRules"
                required
              />

              <v-text-field
                v-model="password"
                :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
                :type="showPass ? 'text' : 'password'"
                label="Password"
                :rules="passwordRules"
                required
                @click:append="showPass = !showPass"
                @keyup.enter="login"
              />
              <v-row
                class="d-flex justify-center mt-3"
              >
                <v-btn
                  :disabled="!valid"
                  color="primary"
                  @click="login"
                >
                  Login
                </v-btn>
              </v-row>
              <v-row class="d-flex justify-center">
                <v-btn
                  text
                  color="gray"
                  @click="goToRegister"
                >
                  Register Account
                </v-btn>
              </v-row>
            </v-form>
          </v-col>
        </v-row>
      </v-card>
    </v-row>
  </v-container>
</template>
<script>
  import axios from 'axios'
  export default {
    name: 'LoginView',
    data: () => ({
      valid: true,
      name: '',
      nameRules: [
        v => !!v || 'Name is required',
      ],
      password: '',
      passwordRules: [
        v => !!v || 'Password is required',
      ],
      showPass: false,
    }),
    methods: {
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
              self.$router.push({ path: '/home' })
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
      goToRegister () {
        this.$router.push({ path: '/auth/register' })
      },
    },
  }
</script>
