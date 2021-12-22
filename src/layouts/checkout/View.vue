<template>
  <v-main>
    <v-sheet
      id="checkout-main-view"
      class="overflow-y-auto pb-16"
      :height="screenHeigth"
    >
      <router-view :key="$route.path" />
    </v-sheet>
  </v-main>
</template>

<script>
  export default {
    name: 'MainView',
    computed: {
      screenHeigth: function () {
        console.log(screen.height)
        return screen.height
      },
    },
  }
</script>
