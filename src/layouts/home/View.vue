<template>
  <v-main>
    <botttom-nav />
    <v-sheet
      id="home-main-view"
      class="overflow-y-auto pb-16"
      :height="screenHeigth"
    >
      <router-view :key="$route.path" />
    </v-sheet>
  </v-main>
</template>

<script>
  import BottomNav from '../home/BottomNav.vue'
  export default {
    name: 'MainView',
    components: {
      'botttom-nav': BottomNav,
    },
    computed: {
      screenHeigth: function () {
        console.log(screen.height - 50)
        return screen.height - 50
      },
    },
  }
</script>
