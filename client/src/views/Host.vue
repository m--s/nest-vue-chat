<template>
  <v-container fluid>
  <v-row>
    <chat
      v-for="chat in chats"
      :key="chat" :name="chat.name" />
  </v-row>
  </v-container>
</template>

<script>
import Chat from '@/components/chat/Chat.vue';

export default {
  name: 'host',
  components: { Chat },
  data: () => ({
    chats: [],
  }),
};
</script>
