<template>
  <v-toolbar dark dense color="#1565C0" elevation="1">
    <span class="subtitle-1">{{name}}</span>

    <v-spacer></v-spacer>

    <v-btn
      small
      text
      icon
      @click="$emit('onClose')"
    >
      <v-icon>mdi-close</v-icon>
    </v-btn>
  </v-toolbar>
</template>

<script>
export default {
  components: {},
  props: ['name'],
  data: () => ({}),
};
</script>
