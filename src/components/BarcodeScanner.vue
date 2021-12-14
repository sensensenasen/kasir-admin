<template>
  <v-row>
    <v-col
      cols="12"
    >
      <image-barcode-reader
        @decode="onDecode"
        @error="onError"
      />
    </v-col>
  </v-row>
</template>
<script>
  import { ImageBarcodeReader } from 'vue-barcode-reader'
  export default {
    name: 'BarcodeScanner',
    components: {
      ImageBarcodeReader,
    },
    props: {
      msg: String,
    },
    data () {
      return {
        text: '',
        id: null,
      }
    },
    methods: {
      onDecode (result) {
        this.$emit('result', result)
      },
      onError (error) {
        this.$emit('error', error)
      },
    },
  }
</script>
