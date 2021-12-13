<template>
  <v-container
    id="keranjang-view"
    fluid
    class="fill-height d-flex align-start"
    tag="section"
  >
    <v-toolbar
      flat
      outlined
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
    </v-toolbar>
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
                <barcode-scanner @result="onScanSuccess" />
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
  </v-container>
</template>
<script>
  import QRModal from '../components/QRModal.vue'
  import Barcodescanner from '../components/BarcodeScanner.vue'
  export default {
    name: 'KeranjangView',
    components: {
      'qr-modal': QRModal,
      'barcode-scanner': Barcodescanner,
    },
    data: () => ({
      sheet: true,
      tab: null,
    }),
    computed: {
      token: function () {
        return localStorage.getItem('token')
      },
    },
    methods: {
      backHome () {
        this.$router.push({ path: '/home' })
      },
      onScanSuccess (result) {
        console.log(result)
        this.sheet = false
      },
    },
  }
</script>
