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
            v-for="(item, i) in items"
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
                    v-text="'RP ' + item.price"
                  />

                  <v-card-actions>
                    <v-btn
                      outlined
                      rounded
                      small
                      icon
                    >
                      <v-icon>
                        mdi-minus
                      </v-icon>
                    </v-btn>
                    <v-btn
                      outlined
                      rounded
                      small
                      icon
                    >
                      <v-icon>
                        mdi-plus
                      </v-icon>
                    </v-btn>
                  </v-card-actions>
                </div>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
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
              class="d-flex align-center"
              flat
            >
              <v-card-text>
                <barcode-scanner
                  @result="onScanSuccess"
                  @error="onScanError"
                />
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
  </v-container>
</template>
<script>
  import QRModal from '../components/QRModal.vue'
  import Barcodescanner from '../components/BarcodeScanner.vue'
  import axios from 'axios'
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
    }),
    computed: {
      token: function () {
        return localStorage.getItem('token')
      },
      apiURL: function () {
        return process.env.VUE_APP_API_URL
      },
    },
    methods: {
      backHome () {
        this.$router.push({ path: '/home' })
      },
      onScanSuccess (barcode) {
        var self = this
        console.log(barcode)
        axios
          .get(process.env.VUE_APP_API_URL + 'products/barcode/' + barcode)
          .then((response) => {
            self.items.push(response.data)
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
    },
  }
</script>
