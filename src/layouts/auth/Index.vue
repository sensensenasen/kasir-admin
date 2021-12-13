<template>
  <v-app>
    <auth-view />
  </v-app>
</template>

<script>
  export default {
    name: 'AuthLayout',

    components: {
      AuthView: () => import(
        /* webpackChunkName: "default-view" */
        './View'
      ),
    },
  }
</script>
