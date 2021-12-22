<template>
  <v-menu
    bottom
    left
    min-width="200"
    offset-y
    origin="top right"
    transition="scale-transition"
  >
    <template v-slot:activator="{ attrs, on }">
      <v-btn
        class="ml-2"
        min-width="0"
        text
        v-bind="attrs"
        v-on="on"
      >
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </template>

    <v-list
      :tile="false"
      flat
      nav
    >
      <app-bar-item>
        <v-list-item-title
          @click="onLogout"
        >
          Logout
        </v-list-item-title>
      </app-bar-item>
    </v-list>
  </v-menu>
</template>

<script>
  export default {
    name: 'DefaultAccount',

    data: () => ({
      profile: [
        { title: 'Profile' },
        { title: 'Settings' },
        { divider: true },
        { title: 'Log out' },
      ],
    }),

    methods: {
      onLogout () {
        // localStorage.removeItem('isAuth')
        // localStorage.removeItem('token')
        // localStorage.removeItem('userRole')
        localStorage.clear()
        this.$router.push({ path: '/auth/login' })
      },
    },
  }
</script>
