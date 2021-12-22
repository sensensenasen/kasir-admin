<template>
  <v-app>
    <checkout-view />
  </v-app>
</template>

<script>
  export default {
    name: 'CheckoutLayout',

    components: {
      CheckoutView: () => import(
        /* webpackChunkName: "default-view" */
        './View'
      ),
    },
  }
</script>
