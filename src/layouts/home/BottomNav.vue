<template>
  <v-bottom-navigation
    absolute
    :value="pointer"
    color="primary"
    hide-on-scroll
    horizontal
    scroll-target="#home-main-view"
    scroll-threshold="500"
  >
    <v-btn
      @click="toHome"
    >
      <span>Home</span>

      <v-icon>mdi-home</v-icon>
    </v-btn>

    <v-btn
      @click="toScan"
    >
      <span>Scan</span>

      <v-icon>mdi-qrcode</v-icon>
    </v-btn>

    <v-btn
      @click="toProfile"
    >
      <span>Profile</span>

      <v-icon>mdi-account</v-icon>
    </v-btn>
  </v-bottom-navigation>
</template>
<script>
  export default {
    name: 'BottomNav',
    data: () => ({
      pointer: 0,
    }),
    methods: {
      toProfile () {
        this.$router.push({ path: '/profile' })
        this.pointer = 2
      },
      toHome () {
        this.$router.push({ path: '/home' })
        this.pointer = 0
      },
      toScan () {
        this.$router.push({ path: '/keranjang' })
      },
    },
  }
</script>
