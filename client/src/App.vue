<template>
  <v-app>

    <navigation></navigation>
    <v-content>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-content>

  </v-app>
</template>

<script>
import Navigation from '@/components/core/Navigation.vue';

export default {
  name: 'App',
  components: {
    Navigation,
  },
  data: () => ({
  }),
};
</script>
