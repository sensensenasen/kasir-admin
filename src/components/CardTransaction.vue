<template>
  <v-card
    elevation="4"
    color="white"
  >
    <v-card-title>
      <div class="text-h4 font-weight-black mr-2">
        {{ '#'+ source.orderCode }}
      </div>
      <div class="mr-2 grey--text">
        {{ orderDateFormat }}
      </div>
      <v-chip
        :color="statusColor"
        label
        outlined
        x-small
      >
        {{ source.status }}
      </v-chip>
    </v-card-title>
    <v-divider />
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
      <label
        class="text--primary mr-2"
        v-text="'Transaction Amount:'"
      />
      <label
        class="font-weight-bold mr-2"
        v-text="'Rp ' + source.transactionAmount"
      />
      <br>
      <label
        class="text--primary mr-2"
        v-text="'Ordered Items:'"
      />
      <v-chip
        v-for="(item, i) in source.items"
        :key="i"
        label
        small
        class="mr-2 mt-1"
      >
        <small class="font-weight-bold">{{ `${item.productName} x ${item.quantity}` }}</small>
      </v-chip>
    </v-card-text>
  </v-card>
</template>
<script>
  import moment from 'moment'
  export default {
    name: 'CardTransaction',
    props: {
      source: Object,
    },
    computed: {
      orderDateFormat: function () {
        var date = new Date(this.source.orderDate)
        return moment(date).format('dddd, DD/MM/YYYY [at] HH:mm')
      },
      statusColor: function () {
        switch (this.source.status) {
          case 'NEW ORDER': return 'primary'
          case 'WAITING PAYMENT': return 'warning'
          case 'DONE': return 'success'
          default: return 'primary'
        }
      },
    },
  }
</script>
