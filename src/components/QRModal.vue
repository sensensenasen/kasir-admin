<template>
  <v-container
    class="light"
    fluid
  >
    <v-row
      class="d-flex text-center justify-center"
    >
      <v-col
        cols="12"
        class="px-4 py-4"
      >
        <qrcode-vue
          :value="token"
          :size="250"
          level="H"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
  import QrcodeVue from 'qrcode.vue'
  export default {
    name: 'QRModal',
    components: {
      QrcodeVue,
    },
    props: {
      token: String,
    },
  }
</script>
