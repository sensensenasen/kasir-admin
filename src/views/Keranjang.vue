<template>
  <v-container
    id="keranjang-view"
    fluid
    class="d-flex flex-wrap align-start"
    tag="section"
  >
    <!-- Toolbar Keranjang -->
    <div class="col-12 mb-0 pb-0">
      <v-toolbar
        flat
        outlined
        class="align-center"
      >
        <v-btn
          icon
          @click="backHome"
        >
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>

        <v-spacer />
        <v-toolbar-title>Keranjang</v-toolbar-title>

        <v-spacer />
        <v-btn
          icon
          small
          color="primary"
          class="mr-1"
          @click="sheet = !sheet"
        >
          <v-icon>mdi-qrcode</v-icon>
        </v-btn>
      </v-toolbar>
    </div>
    <!-- Body Card Items -->
    <div class="col-12 mt-1 pt-1">
      <v-container
        class="fill-height d-flex align-start mx-0 my-0 px-0 py-0"
      >
        <v-row dense>
          <v-col
            v-for="(item, i) in orderObj.orderItems"
            :key="i"
            cols="12"
          >
            <v-card
              elevation="4"
              color="white"
            >
              <div class="d-flex flex-no-wrap justify-space-between">
                <v-avatar
                  class="ma-3"
                  size="125"
                  tile
                >
                  <v-img
                    :src="apiURL + item.productImage"
                    aspect-ratio="1.7"
                  />
                </v-avatar>
                <div>
                  <v-card-title
                    class="text-small"
                    v-text="item.productName"
                  />

                  <v-card-subtitle
                    v-text="'RP ' + item.priceEach"
                  />
                  <v-card-actions>
                    <v-btn
                      outlined
                      rounded
                      x-small
                      icon
                      @click="quantityMinus(item)"
                    >
                      <v-icon>
                        mdi-minus
                      </v-icon>
                    </v-btn>
                    <label
                      class="px-2"
                      v-text="item.quantity"
                    />
                    <v-btn
                      outlined
                      rounded
                      x-small
                      icon
                      @click="quantityPlus(item)"
                    >
                      <v-icon>
                        mdi-plus
                      </v-icon>
                    </v-btn>
                    <label
                      class="ml-2 text--secondary"
                      v-text="'Rp ' + item.quantity * item.priceEach"
                    />
                  </v-card-actions>
                </div>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </div>
    <!-- Keranjang kosong -->
    <v-row
      v-if="orderObj.orderItems.length == 0"
      class="d-flex flex-column mt-12"
      justify="center"
    >
      <v-icon
        x-large
        color="gray"
      >
        mdi-cart-variant
      </v-icon>
      <p class="text--secondary text-center">
        Keranjang kosong
      </p>
    </v-row>
    <!-- Footer Checkout -->
    <div
      v-if="orderObj.orderItems.length > 0"
      class="col-12 mt-2 d-flex flex-column"
    >
      <v-divider />
      <label
        class="font-weight-bold text-right py-2"
        v-text="trAmountFormat"
      />
      <v-btn
        color="primary"
        depressed
        @click="onCheckout"
      >
        Checkout
      </v-btn>
    </div>
    <!-- Popup Bottom Sheet -->
    <v-bottom-sheet
      v-model="sheet"
      persistent
    >
      <v-sheet
        class="text-center"
        height="450px"
      >
        <v-tabs
          v-model="tab"
          background-color="transparent"
          grow
        >
          <v-tab href="#tab-scan">
            Scan Barcode
          </v-tab>
          <v-tab href="#tab-masuk">
            Barcode Masuk
          </v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab">
          <v-tab-item
            :value="'tab-scan'"
          >
            <v-card
              height="300"
              class="d-flex align-center justify-center"
              flat
            >
              <v-card-text>
                <v-row
                  class="ml-8"
                  justify="center"
                >
                  <barcode-scanner
                    @result="onScanSuccess"
                    @error="onScanError"
                  />
                </v-row>
                <!-- Inputan Manual -->
                <v-row
                  v-if="manualScan"
                  justify="center"
                  align="center"
                  class="px-2"
                >
                  <v-text-field
                    v-model="manualInput"
                    clearable
                    flat
                    solo-inverted
                    hide-details
                    prepend-inner-icon="mdi-qrcode"
                    :label="'Input Barcode'"
                  />
                  <v-btn
                    color="primary"
                    height="48"
                    @click="onScanSuccess(manualInput)"
                  >
                    <v-icon>mdi-magnify-expand</v-icon>
                  </v-btn>
                </v-row>
                <!-- Try Input -->
                <v-row
                  justify="center"
                >
                  <v-btn
                    text
                    small
                    color="primary"
                    class="mt-2"
                    @click="manualScan = !manualScan"
                  >
                    <small>
                      Try Input
                    </small>
                    <v-icon>{{ manualScan ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
                  </v-btn>
                </v-row>
                <!-- Button Hint -->
                <v-row
                  class="mt-4"
                  justify="center"
                >
                  <v-btn
                    color="grey"
                    class="mt-2"
                    x-small
                    text
                    @click="onClickHint"
                  >
                    <small class="mr-1">Panduan</small>
                    <v-icon small>
                      mdi-information-outline
                    </v-icon>
                  </v-btn>
                </v-row>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item
            :value="'tab-masuk'"
          >
            <v-card
              flat
            >
              <qr-modal :token="token" />
            </v-card>
          </v-tab-item>
        </v-tabs-items>
        <v-btn
          class="mt-6"
          text
          color="error"
          @click="sheet = !sheet"
        >
          close
        </v-btn>
      </v-sheet>
    </v-bottom-sheet>

    <!-- Dialog error -->
    <v-dialog
      v-model="dialogError"
      width="300"
    >
      <v-card>
        <v-card-text>
          <v-container fluid>
            <div class="row d-flex align-center text-center">
              <div class="col-12">
                <v-icon
                  x-large
                  color="error"
                >
                  mdi-alert-outline
                </v-icon>
              </div>
              <div class="col-12">
                <h4>
                  Barcode tidak terbaca dengan baik
                </h4>
                <br>
                <span>
                  Silakan ulangi scan barcode
                </span>
              </div>
            </div>
          </v-container>
        </v-card-text>

        <v-divider />

        <v-card-actions>
          <v-spacer />
          <v-btn
            color="error"
            text
            @click="dialogError = false"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog Hint -->
    <v-dialog
      v-model="dialogHint"
      width="400"
    >
      <v-card>
        <v-card-text>
          <v-container fluid>
            <div class="row d-flex align-center text-center">
              <div class="col-12 mb-0">
                <v-icon
                  x-large
                  color="grey"
                >
                  mdi-information-outline
                </v-icon>
                <p class="font-weight-bold grey--text">
                  Panduan
                </p>
              </div>
              <div class="col-12 mt-0">
                <v-carousel
                  height="300"
                  hide-delimiters
                >
                  <v-carousel-item
                    v-for="(item,i) in hintItems"
                    :key="i"
                  >
                    <v-sheet
                      height="300"
                    >
                      <v-img :src="item.src" />
                    </v-sheet>
                  </v-carousel-item>
                </v-carousel>
              </div>
            </div>
          </v-container>
        </v-card-text>

        <v-divider />

        <v-card-actions>
          <v-spacer />
          <v-btn
            color="black"
            text
            @click="dialogHint = false"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
  import QRModal from '../components/QRModal.vue'
  import Barcodescanner from '../components/BarcodeScanner.vue'
  import axios from 'axios'
  import hint1 from '../assets/hint/hint-scan-1.png'
  import hint2 from '../assets/hint/hint-scan-2.png'
  import hint3 from '../assets/hint/hint-scan-3.png'
  import hint4 from '../assets/hint/hint-scan-4.png'
  export default {
    name: 'KeranjangView',
    components: {
      'qr-modal': QRModal,
      'barcode-scanner': Barcodescanner,
    },
    data: () => ({
      sheet: false,
      tab: null,
      items: [],
      dialogError: false,
      dialogHint: false,
      hintItems: [
        {
          src: hint1,
        },
        {
          src: hint2,
        },
        {
          src: hint3,
        },
        {
          src: hint4,
        },
      ],
      orderObj: {
        status: 'NEW ORDER',
        transactionAmount: 0,
        customerid: null,
        orderItems: [],
      },
      manualScan: false,
      manualInput: '',
    }),
    computed: {
      token: function () {
        return localStorage.getItem('token')
      },
      apiURL: function () {
        return process.env.VUE_APP_API_URL
      },
      trAmountFormat: function () {
        return 'Total: Rp ' + this.orderObj.transactionAmount.toFixed(0).replace(/./g, function (c, i, a) {
          return i > 0 && c !== '.' && (a.length - i) % 3 === 0 ? ',' + c : c
        })
      },
    },
    created () {
      this.initialize()
    },
    methods: {
      initialize () {
        var self = this
        var keranjang = JSON.parse(localStorage.getItem('orderObj'))
        if (keranjang !== null) {
          self.orderObj = keranjang
        }
      },
      backHome () {
        this.$router.push({ path: '/home' })
      },
      onScanSuccess (barcode) {
        var self = this
        console.log(barcode)
        axios
          .get(process.env.VUE_APP_API_URL + 'products/barcode/' + barcode)
          .then((response) => {
            console.log(response.data)
            // cek di keranjang produk dengan barcode yang sama
            var result = self.orderObj.orderItems.find(x => x.productCode === barcode)
            console.log(result)
            if (result === undefined) {
              // kalo barcode yang di scan baru, tambah baru ke keranjang
              var items = {
                productName: response.data.productName,
                productVendor: response.data.productVendor,
                productCode: response.data.productCode,
                productImage: response.data.productImage,
                quantity: 1,
                priceEach: response.data.price,
                productId: response.data.id,
              }
              self.orderObj.orderItems.push(items)
            } else {
              // result == ada, tinggal update quantity saja
              var index = self.orderObj.orderItems.map((e) => { return e.productCode }).indexOf(barcode)
              self.orderObj.orderItems[index].quantity += 1
            }

            self.orderObj.transactionAmount += response.data.price
            localStorage.setItem('orderObj', JSON.stringify(self.orderObj))
            self.sheet = false
          })
          .catch((error) => {
            if (error.response.data) {
              self.$toast.error(error.response.data.message, {
                type: 'error',
                position: 'top-right',
                duration: 3000,
                dismissible: true,
              })
            }
          })
      },
      onScanError (error) {
        console.log(error)
        this.dialogError = true
      },
      onClickHint () {
        this.dialogHint = true
      },
      quantityPlus (item) {
        var self = this
        var index = self.orderObj.orderItems.map((e) => { return e.productCode }).indexOf(item.productCode)
        self.orderObj.orderItems[index].quantity += 1
        self.orderObj.transactionAmount += item.priceEach
        localStorage.setItem('orderObj', JSON.stringify(self.orderObj))
      },
      quantityMinus (item) {
        var self = this
        var index = self.orderObj.orderItems.map((e) => { return e.productCode }).indexOf(item.productCode)
        if (self.orderObj.orderItems[index].quantity === 1) {
          self.orderObj.transactionAmount -= item.priceEach
          self.orderObj.orderItems.splice(index, 1)
        } else {
          self.orderObj.orderItems[index].quantity -= 1
          self.orderObj.transactionAmount -= item.priceEach
        }
        localStorage.setItem('orderObj', JSON.stringify(self.orderObj))
      },
      onCheckout () {
        var self = this
        var user = JSON.parse(localStorage.getItem('userData'))
        self.orderObj.customerid = user.id
        console.log(self.orderObj)
        axios
          .post(process.env.VUE_APP_API_URL + 'orders', self.orderObj)
          .then((response) => {
            console.log(response.data)
            localStorage.removeItem('orderObj')
            localStorage.setItem('checkoutData', JSON.stringify(response.data))
            self.$router.push({ path: '/checkout/success' })
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
    },
  }
</script>
