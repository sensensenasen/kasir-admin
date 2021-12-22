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
        <v-row justify="center">
          <v-col
            cols="12"
          >
            <h2 class="mb-2">
              Register
            </h2>
            <v-form
              ref="form"
              v-model="valid"
              lazy-validation
            >
              <v-text-field
                v-model="userName"
                label="User Name"
                :rules="nameRules"
                required
              />

              <v-text-field
                v-model="fullName"
                label="Full Name"
                required
              />

              <v-text-field
                v-model="email"
                label="Email"
                :rules="emailRules"
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
                @keyup.enter="register"
              />
              <!-- <v-text-field
                v-model="repassword"
                :append-icon="showPass2 ? 'mdi-eye' : 'mdi-eye-off'"
                :type="showPass2 ? 'text' : 'password'"
                label="Retype Password"
                :rules="passwordRules"
                required
                @click:append="showPass2 = !showPass2"
                @keyup.enter="register"
              /> -->
              <v-row
                class="d-flex justify-center mt-3"
              >
                <v-btn
                  :disabled="!valid"
                  color="primary"
                  @click="register"
                >
                  Register
                </v-btn>
              </v-row>
              <v-row
                class="d-flex justify-center"
              >
                <v-btn
                  text
                  color="gray"
                  @click="goToLogin"
                >
                  Back to Login
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
      userName: '',
      nameRules: [
        v => !!v || 'Name is required',
        v => /[a-z0-9]/.test(v) || 'username must be lower case and number',
      ],
      email: '',
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+/.test(v) || 'E-mail must be valid',
      ],
      password: '',
      repassword: '',
      passwordRules: [
        v => !!v || 'Password is required',
      ],
      repasswordRules: [
        v => !!v || 'Password is required',
        v => v === this.password || 'Password doesnt match',
      ],
      fullName: '',
      showPass: false,
      showPass2: false,
    }),
    methods: {
      register () {
        var self = this
        var registerObj = {
          userName: self.userName,
          password: self.password,
          email: self.email,
          userRole: 'user',
          fullName: self.fullName,
          phone: '08XXXXXX',
          gender: 'gender',
        }

        axios
          .post(process.env.VUE_APP_API_URL + 'users/register', registerObj)
          .then((response) => {
            self.$toast.success('Register user berhasil', {
              type: 'success',
              position: 'top-right',
              duration: 3000,
              dismissible: true,
            })
            self.$router.push({ path: '/auth/login' })
          })
          .catch((error) => {
            if (error.response.data) {
              if (error.response.data.message) {
                self.$toast.error(error.response.data.message, {
                  type: 'error',
                  position: 'top-right',
                  duration: 3000,
                  dismissible: true,
                })
              } else {
                self.$toast.error(error.response.data, {
                  type: 'error',
                  position: 'top-right',
                  duration: 3000,
                  dismissible: true,
                })
              }
            }
          })
      },
      reset () {
        this.$refs.form.reset()
      },
      goToLogin () {
        this.$router.push({ path: '/auth/login' })
      },
    },
  }
</script>
