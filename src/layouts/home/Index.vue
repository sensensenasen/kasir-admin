<template>
  <v-app>
    <home-view />
  </v-app>
</template>

<script>
  export default {
    name: 'HomeLayout',

    components: {
      HomeView: () => import(
        /* webpackChunkName: "default-view" */
        './View'
      ),
    },
  }
</script>
