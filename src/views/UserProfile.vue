<template>
  <v-container
    id="user-profile-view"
    fluid
    class="fill-height"
    tag="section"
  >
    <v-row justify="center">
      <!-- <v-col
        cols="12"
        md="8"
      >
        <material-card
          color="primary"
          icon="mdi-account-outline"
        >
          <template #title>
            Edit Profile — <small class="text-body-1">Complete your profile</small>
          </template>

          <v-form>
            <v-container class="py-0">
              <v-row>
                <v-col
                  cols="12"
                  md="4"
                >
                  <v-text-field
                    disabled
                    label="Company (disabled)"
                  />
                </v-col>

                <v-col
                  cols="12"
                  md="4"
                >
                  <v-text-field
                    color="purple"
                    label="User Name"
                  />
                </v-col>

                <v-col
                  cols="12"
                  md="4"
                >
                  <v-text-field
                    color="purple"
                    label="Email Address"
                  />
                </v-col>

                <v-col
                  cols="12"
                  md="6"
                >
                  <v-text-field
                    color="purple"
                    label="First Name"
                  />
                </v-col>

                <v-col
                  cols="12"
                  md="6"
                >
                  <v-text-field
                    color="purple"
                    label="Last Name"
                  />
                </v-col>

                <v-col cols="12">
                  <v-text-field
                    color="purple"
                    label="Adress"
                  />
                </v-col>

                <v-col
                  cols="12"
                  md="4"
                >
                  <v-text-field
                    color="purple"
                    label="City"
                  />
                </v-col>

                <v-col
                  cols="12"
                  md="4"
                >
                  <v-text-field
                    color="purple"
                    label="Country"
                  />
                </v-col>

                <v-col
                  cols="12"
                  md="4"
                >
                  <v-text-field
                    color="purple"
                    label="Postal Code"
                    type="number"
                  />
                </v-col>

                <v-col cols="12">
                  <v-textarea
                    color="purple"
                    label="About Me"
                    value="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
                  />
                </v-col>

                <v-col
                  cols="12"
                  class="text-right"
                >
                  <v-btn
                    color="primary"
                    min-width="150"
                  >
                    Update Profile
                  </v-btn>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </material-card>
      </v-col> -->

      <v-col
        cols="12"
        md="4"
      >
        <app-card class="mt-4 text-center">
          <v-img
            class="rounded-circle elevation-6 mt-n12 d-inline-block"
            :src="avatarURL"
            width="128"
            height="128"
          />
          <v-fab-transition>
            <v-btn
              class="mt-12 ml-n8 d-inline-block"
              color="primary"
              dark
              absolute
              top
              center
              fab
              small
              @click="onEditAvatar"
            >
              <v-icon>mdi-camera</v-icon>
            </v-btn>
          </v-fab-transition>

          <v-card-text class="text-center">
            <h6 class="text-h6 mb-2 text--secondary">
              {{ userData.email }}
            </h6>
            <span class="text-h6 mb-2 text--secondary">
              <v-icon small>
                mdi-phone
              </v-icon>
              {{ userData.phone }}
            </span>
            <h4 class="text-h4 mt-3 mb-3 text--primary">
              <span>
                <v-icon
                  small
                >{{ genderIcon }}</v-icon>
              </span>
              {{ userData.fullName }}
            </h4>

            <p
              v-if="userData.bio === null"
              class="text--secondary"
            >
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ratione dolorem deserunt veniam tempora magnam quisquam quam error iusto cupiditate ducimus, et eligendi saepe voluptatibus assumenda similique temporibus placeat animi dicta?
            </p>

            <p
              v-else
              class="text--secondary"
            >
              {{ userData.bio }}
            </p>

            <v-row justify="center">
              <v-btn
                class="mr-0"
                color="primary"
                min-width="100"
                @click="onEditProfile"
              >
                Edit Data
              </v-btn>
            </v-row>
            <v-row justify="center">
              <v-btn
                class="mr-0 mt-2"
                color="grey"
                min-width="100"
                @click="onShowQR"
              >
                Show My QR
              </v-btn>
            </v-row>
            <v-row justify="center">
              <v-btn
                class="mr-0 mt-2"
                color="danger"
                small
                text
                @click="onLogout"
              >
                Logout
              </v-btn>
            </v-row>
          </v-card-text>
        </app-card>
      </v-col>
      <v-dialog
        v-model="dialogQR"
        width="300"
        height="300"
      >
        <v-card>
          <v-card-title class="text-h5 primary">
            My QR Code
          </v-card-title>

          <qr-modal :token="token" />

          <v-divider />

          <v-card-actions>
            <v-spacer />
            <v-btn
              color="primary"
              text
              @click="dialogQR = false"
            >
              Close
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog
        v-model="dialogUpload"
        width="300"
        height="100"
      >
        <v-card>
          <v-container
            fluid
          >
            <v-row
              class="d-flex align-center text-center"
            >
              <v-col
                cols="12"
                sm="12"
                md="12"
              >
                <v-file-input
                  v-model="fileUploadImage"
                  :rules="rulesAvatar"
                  show-size
                  accept="image/png, image/jpeg"
                  placeholder="Pick an Profile image"
                  prepend-icon="mdi-camera"
                  label="Profile Image"
                />
              </v-col>
              <v-col
                v-if="loading"
                cols="12"
                sm="12"
                md="12"
              >
                <v-progress-circular
                  indeterminate
                  color="primary"
                />
              </v-col>
            </v-row>
          </v-container>

          <v-card-actions>
            <v-spacer />
            <v-btn
              color="primary"
              text
              @click="dialogUpload = false"
            >
              Close
            </v-btn>
            <v-btn
              color="primary"
              text
              @click="uploadProfileImage"
            >
              Upload
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog
        v-model="dialogEdit"
        width="400"
        height="400"
      >
        <v-card>
          <v-card-title class="text-h5 primary">
            Edit Profile
          </v-card-title>

          <v-card-text>
            <v-container fluid>
              <v-row>
                <v-col
                  cols="12"
                  sm="12"
                  md="12"
                >
                  <v-text-field
                    v-model="editUserData.fullName"
                    label="Nama Lengkap"
                  />
                </v-col>
                <v-col
                  cols="12"
                  sm="12"
                  md="12"
                >
                  <v-text-field
                    v-model="editUserData.email"
                    label="Email"
                  />
                </v-col>
                <v-col
                  cols="12"
                  sm="12"
                  md="12"
                >
                  <v-text-field
                    v-model="editUserData.phone"
                    label="No. Handphone"
                  />
                </v-col>
                <v-col
                  cols="12"
                  sm="12"
                  md="12"
                >
                  <v-select
                    v-model="editUserData.gender"
                    :items="genderDs"
                    label="Jenis Kelamin"
                  />
                </v-col>
                <v-col
                  cols="12"
                  sm="12"
                  md="12"
                >
                  <v-textarea
                    v-model="editUserData.bio"
                    label="Bio"
                    auto-grow
                    rows="3"
                  />
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>

          <v-divider />

          <v-card-actions>
            <v-spacer />
            <v-btn
              color="primary"
              text
              @click="dialogEdit = false"
            >
              Cancel
            </v-btn>
            <v-btn
              color="primary"
              text
              @click="updateProfile"
            >
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </v-container>
</template>

<script>
  import axios from 'axios'
  import QRModal from '../components/QRModal.vue'
  export default {
    name: 'UserProfileView',
    components: {
      'qr-modal': QRModal,
    },
    data: () => ({
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
      dialogQR: false,
      dialogEdit: false,
      dialogUpload: false,
      editUserData: {},
      rulesAvatar: [
        value => !value || value.size < 2000000 || 'Avatar size should be less than 2 MB!',
      ],
      fileUploadImage: undefined,
      loading: false,
      genderDs: [
        'laki-laki',
        'perempuan',
      ],
    }),
    computed: {
      avatarURL: function () {
        var url = process.env.VUE_APP_API_URL + 'uploads/blank-profile.jpg'
        if (this.userData.profileImage) {
          url = process.env.VUE_APP_API_URL + this.userData.profileImage
        }
        return url
      },
      genderIcon: function () {
        if (this.userData.gender === 'laki-laki') {
          return 'mdi-gender-male'
        } else {
          return 'mdi-gender-female'
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
        var user = JSON.parse(localStorage.getItem('userData'))
        if (user === null) {
          axios
            .get(process.env.VUE_APP_API_URL + 'users/token/' + self.token)
            .then((response) => {
              self.userData = response.data
              localStorage.setItem('userData', JSON.stringify(self.userData))
            })
            .catch((error) => console.log(error))
        } else {
          self.userData = user
        }
      },
      onShowQR () {
        this.dialogQR = true
      },
      onEditProfile () {
        this.editUserData = Object.assign({}, this.userData)
        this.dialogEdit = true
      },
      onEditAvatar () {
        this.dialogUpload = true
      },
      updateProfile () {
        var self = this
        const putObj = {
          fullName: self.editUserData.fullName,
          email: self.editUserData.email,
          phone: self.editUserData.phone,
          bio: self.editUserData.bio,
          gender: self.editUserData.gender,
          id: self.editUserData.id,
        }

        axios.put(process.env.VUE_APP_API_URL + 'users/id/' + self.editUserData.id, putObj)
          .then((response) => {
            localStorage.setItem('userData', JSON.stringify(response.data))
            self.$toast.success('Sukses update profile', {
              type: 'success',
              position: 'top-right',
              duration: 3000,
              dismissible: true,
            })
            self.initialize()
            self.dialogEdit = false
          })
          .catch((error) => {
            self.$toast.error(error.response.data.message, {
              type: 'error',
              position: 'top-right',
              duration: 3000,
              dismissible: true,
            })
          })
      },
      uploadProfileImage () {
        var self = this
        self.loading = true
        var formData = new FormData()
        formData.append('profileImage', this.fileUploadImage)
        formData.append('id', this.userData.id)
        formData.append('prevProfileImage', this.userData.profileImage)

        axios.post(process.env.VUE_APP_API_URL + 'users/uploads', formData)
          .then((response) => {
            localStorage.setItem('userData', JSON.stringify(response.data))
            self.$toast.success('Sukses upload profile image', {
              type: 'success',
              position: 'top-right',
              duration: 3000,
              dismissible: true,
            })
            self.initialize()
            self.dialogUpload = false
            self.loading = false
          })
          .catch((error) => {
            console.log(error)
            self.loading = false
            self.$toast.error('Gagal upload image', {
              type: 'error',
              position: 'top-right',
              duration: 3000,
              dismissible: true,
            })
          })
      },
      onLogout () {
        // localStorage.removeItem('isAuth')
        // localStorage.removeItem('token')
        // localStorage.removeItem('userRole')
        localStorage.clear()
        this.$router.push({ path: '/auth/login' })
      },
    },
  }
</script>
