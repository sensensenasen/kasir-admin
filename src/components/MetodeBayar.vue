<template>
  <v-container>
    <!-- Header -->
    <div class="col-12">
      <label
        class="font-weight-black text-h3"
        v-text="'Pilih Metode Bayar'"
      />
    </div>
    <!-- Image Doodle -->
    <div class="col-12 d-flex justify-center">
      <v-img
        contain
        :src="doodle1"
        height="125"
        width="125"
      />
    </div>
    <!-- Body Card -->
    <div class="col-12 py-1 my-1">
      <label
        class="text-caption grey--text"
        v-text="'Saldo'"
      />
      <br>
      <v-card
        color="white"
        @click="bayar"
      >
        <div class="d-flex flex-no-wrap justify-space-between">
          <div>
            <v-card-title
              class="text-h4 font-weight-black"
              v-text="saldoFormat"
            />
          </div>
          <label
            v-if="saldoKurang"
            class="font-weight-bold align-center mt-4 mr-2"
            v-text="'Top Up'"
          />
          <v-icon
            v-else
            class="mr-2"
          >
            mdi-chevron-right
          </v-icon>
        </div>
      </v-card>
    </div>
    <!-- Label saldo kurang -->
    <div
      v-if="saldoKurang"
      class="col-12 py-0 my-1"
    >
      <small
        class="text-small error--text text--lighten-2"
        v-text="'Saldo anda kurang, yuk top up dulu'"
      />
    </div>
    <!-- Label total belanja -->
    <div class="col-12 py-1 my-1">
      <label
        class="font-weight-black primary--text mr-2"
        v-text="'Total Belanja: ' + transactionAmount"
      />
    </div>
    <!-- Dialog Topup -->
    <v-dialog
      v-model="dialogTopup"
      width="400"
    >
      <card-topup @callback="topupCb" />
    </v-dialog>
    <!-- Dialog Bayar -->
    <v-dialog
      v-model="dialogBayar"
      width="400"
    >
      <v-card>
        <v-card-title>
          Gunakan Saldo
        </v-card-title>
        <v-divider />
        <v-card-text class="py-2">
          <label
            v-text="'Saldo akan dikurangi sebesar ' + transactionAmount + '. Apa anda yakin melanjutkan pembayaran?'"
          />
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn
            color="error lighten-2"
            text
            @click="dialogBayar = false"
          >
            Close
          </v-btn>

          <v-btn
            color="primary"
            text
            @click="bayarSuccess"
          >
            Bayar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
  import doodle1 from '../assets/doodle/1.png'
  import doodle2 from '../assets/doodle/2.png'
  import CardTopup from '../components/CardTopup.vue'
  import moment from 'moment'
  import axios from 'axios'
  export default {
    name: 'MetodeBayar',
    components: {
      'card-topup': CardTopup,
    },
    props: {
      source: Object,
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
      doodle1: doodle1,
      doodle2: doodle2,
      dialogQR: false,
      dialogTopup: false,
      dialogBayar: false,
    }),
    computed: {
      orderDateFormat: function () {
        var date = new Date(this.source.orderDate)
        return moment(date).format('dddd, DD/MM/YYYY [at] HH:mm')
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
      transactionAmount: function () {
        var data = JSON.parse(localStorage.getItem('checkoutData'))
        return 'Rp ' + data.transactionAmount.toFixed(0).replace(/./g, function (c, i, a) {
          return i > 0 && c !== '.' && (a.length - i) % 3 === 0 ? ',' + c : c
        })
      },
      saldoKurang: function () {
        var data = JSON.parse(localStorage.getItem('checkoutData'))
        if (this.userData.saldo < data.transactionAmount) {
          return true
        } else {
          return false
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
      bayar () {
        if (this.saldoKurang) {
          this.dialogTopup = true
        } else {
          this.dialogBayar = true
        }
      },
      topupCb (cb) {
        if (cb.cancel) {
          this.dialogTopup = false
        } else if (cb.submit) {
          this.dialogTopup = false
          this.initialize()
        }
      },
      bayarSuccess () {
        var self = this
        var checkoutData = JSON.parse(localStorage.getItem('checkoutData'))
        var updateObj = {
          status: 'DONE',
        }
        axios
          .put(process.env.VUE_APP_API_URL + 'orders/bayar/' + checkoutData.id, updateObj)
          .then((response) => {
            console.log(response.data)
            self.dialogBayar = false
            localStorage.setItem('checkoutData', JSON.stringify(response.data))
            self.$toast.success(response.data.status, {
              type: 'success',
              position: 'top-right',
              duration: 3000,
              dismissible: true,
            })
            self.$emit('eventbayar', 'sukses')
          })
          .catch((error) => {
            if (error.response.data) {
              console.log(error)
              self.dialogBayar = false
              self.$toast.error(error.response.data.message, {
                type: 'error',
                position: 'top-right',
                duration: 3000,
                dismissible: true,
              })
            }
          })
      },
    },
  }
</script>
