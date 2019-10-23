<template>
  <v-container fluid>
    <v-card
      v-if="!connected"
      shaped
      class="ma-4 pa-4 mx-auto"
      max-width="344"
    >
      <v-card-text>
        <div>Nest + Vue</div>
        <p class="display-1 text--primary">
          Chat
        </p>

        <v-text-field
          v-model="name"
          label="Name"
          required
        ></v-text-field>
      </v-card-text>

      <v-card-actions>
        <v-btn class="primary mx-auto flex-fill" @click="connected = true">Log in</v-btn>
      </v-card-actions>
    </v-card>

    <chat name="Host" v-if="connected" />

  </v-container>
</template>

<script>
import Chat from '@/components/chat/Chat.vue';

export default {
  name: 'client',
  components: {
    Chat,
  },
  data: () => ({
    name: null,
    connected: false,
  }),
  mounted() {
    this.name = this.getRandomName();
  },
  methods: {
    getRandomName() {
      const rand = Math.round(Math.random() * 100);
      return `Anonymous${rand}`;
    },
  },
};
</script>
