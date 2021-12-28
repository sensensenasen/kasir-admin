<template>
  <v-card>
    <v-card-title>
      <div class="text-h4 font-weight-black mr-2">
        {{ '#' + source.orderCode }}
      </div>
      <div class="mr-2 grey--text">
        {{ orderDateFormat }}
      </div>
    </v-card-title>
    <v-card-text>
      <div class="row px-3">
        <div class="col-6 mx-0 px-0 mt-0 pt-0">
          <label
            class="text--primary"
            v-text="'Name'"
          />
          <br>
          <label
            class="font-weight-bold"
            v-text="source.customer.fullName"
          />
        </div>
        <div class="col-6 mx-0 px-0 mt-0 pt-0">
          <label
            class="text--primary"
            v-text="'Contact'"
          />
          <br>
          <label
            class="font-weight-bold"
            v-text="source.customer.phone"
          />
        </div>
      </div>
      <v-divider class="mb-2" />
      <label
        class="font-weight-black black--text mr-2"
        v-text="'Total Belanja:'"
      />
      <label
        class="font-weight-black black--text mr-2"
        v-text="saldoFormat"
      />
    </v-card-text>
  </v-card>
</template>
<script>
  import moment from 'moment'
  export default {
    name: 'CardCheckout',
    props: {
      source: Object,
    },
    computed: {
      orderDateFormat: function () {
        var date = new Date(this.source.orderDate)
        return moment(date).format('dddd, DD/MM/YYYY [at] HH:mm')
      },
      saldoFormat: function () {
        if (this.source.transactionAmount !== null) {
          return 'Rp ' + this.source.transactionAmount.toFixed(0).replace(/./g, function (c, i, a) {
            return i > 0 && c !== '.' && (a.length - i) % 3 === 0 ? ',' + c : c
          })
        } else {
          return 'Rp 0'
        }
      },
    },
  }
</script>
