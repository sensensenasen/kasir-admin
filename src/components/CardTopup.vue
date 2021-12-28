<template>
  <v-card>
    <v-card-title>
      Top Up
    </v-card-title>
    <v-divider />
    <v-card-text class="py-2">
      <v-text-field
        v-model="updSaldo"
        class="col-10"
        type="number"
        clearable
        flat
        solo-inverted
        hide-details
        prefix="Rp"
        :label="'Jumlah top up'"
      />
    </v-card-text>
    <v-card-actions class="justify-end">
      <v-btn
        color="error lighten-2"
        text
        @click="close"
      >
        Close
      </v-btn>

      <v-btn
        color="primary"
        text
        @click="topup"
      >
        Top Up
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
  import axios from 'axios'
  export default {
    name: 'CardTopup',
    data: () => ({
      updSaldo: 0,
    }),
    methods: {
      close () {
        var result = {
          cancel: true,
          submit: false,
        }
        this.$emit('callback', result)
      },
      topup () {
        var self = this
        var userData = JSON.parse(localStorage.getItem('userData'))
        var putObj = {
          amount: self.updSaldo,
        }

        axios.put(process.env.VUE_APP_API_URL + 'users/topup/' + userData.id, putObj)
          .then((response) => {
            console.log(response.data)
            localStorage.setItem('userData', JSON.stringify(response.data.user))
            self.$toast.success('Sukses Top Up', {
              type: 'success',
              position: 'top-right',
              duration: 3000,
              dismissible: true,
            })

            var result = {
              cancel: false,
              submit: true,
            }
            self.$emit('callback', result)
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
    },
  }
</script>
