<template>
  <v-container
    id="checkout-success-view"
    fluid
    class="d-flex align-start"
    tag="section"
  >
    <v-row>
      <v-container
        fluid
      >
        <!-- Header -->
        <div class="col-12">
          <label
            class="font-weight-black text-h3"
            v-text="'Belanjaan Berhasil di Checkout!'"
          />
        </div>
        <!-- Image Doodle -->
        <div class="col-12 d-flex justify-center">
          <v-img
            contain
            :src="doodle2"
            height="125"
            width="125"
          />
        </div>
        <!-- Body Card -->
        <div class="col-12 py-1 my-1">
          <card-checkout :source="checkoutData" />
        </div>
        <!-- Button Lanjutkan Pembayaran -->
        <div class="col-12">
          <v-btn
            depressed
            color="primary"
            width="100%"
            @click="lanjutkanPembayaran"
          >
            Lanjutkan Pembayaran
          </v-btn>
        </div>
      </v-container>
    </v-row>
  </v-container>
</template>
<script>
  import doodle1 from '../assets/doodle/1.png'
  import doodle2 from '../assets/doodle/2.png'
  import Card from '../components/CardCheckout.vue'
  import axios from 'axios'
  export default {
    name: 'CheckoutSuccess',
    components: {
      'card-checkout': Card,
    },
    data: () => ({
      doodle1: doodle1,
      doodle2: doodle2,
      checkoutData: {
        status: '',
        transactionAmount: 0,
        customer: [],
        orderItems: [],
        id: 0,
        orderCode: '',
        orderDate: new Date(),
      },
    }),
    created () {
      this.initialize()
    },
    methods: {
      initialize () {
        var self = this
        var data = JSON.parse(localStorage.getItem('checkoutData'))
        if (data !== null) {
          self.checkoutData = data
        }
      },
      lanjutkanPembayaran () {
        var self = this
        var updateObj = {
          status: 'WAITING PAYMENT',
        }
        axios
          .put(process.env.VUE_APP_API_URL + 'orders/id/' + self.checkoutData.id, updateObj)
          .then((response) => {
            console.log(response.data)
            localStorage.setItem('checkoutData', JSON.stringify(response.data))
            self.$toast.success(response.data.status, {
              type: 'success',
              position: 'top-right',
              duration: 3000,
              dismissible: true,
            })
          })
          .catch((error) => {
            if (error.response.data) {
              console.log(error)
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
