<template>
  <v-navigation-drawer app dark permanent>
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title class="title">
          Nest + Vue
        </v-list-item-title>
        <v-list-item-subtitle>
          chat
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>

    <v-divider></v-divider>

    <v-list
      dense
      nav
    >
      <v-list-item
        v-for="item in items"
        :key="item.title"
        link
        :to="item.route"
        target="_blank"
      >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: 'navigation',
  components: {},
  data: () => ({
    items: [
      { title: 'Client', icon: 'mdi-comment-outline', route: '/client' },
      { title: 'Host', icon: 'mdi-comment-multiple-outline', route: '/host' },
    ],
  }),
};
</script>
