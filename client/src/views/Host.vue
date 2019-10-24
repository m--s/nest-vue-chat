<template>
  <v-container fluid>
  <v-row>
    <chat
      v-for="room in rooms" userType="host"
      :key="room.id" name="Host" :recipientName="room.name" :recipientId="room.id" />
  </v-row>
  </v-container>
</template>

<script>
import Chat from '@/components/chat/Chat.vue';

export default {
  name: 'host',
  components: { Chat },
  sockets: {
    activeRooms(rooms) {
      this.rooms = rooms;
    },
    newRoom(room) {
      this.rooms = [...this.rooms, room];
    },
    userDisconnected(roomId) {
      this.rooms = this.rooms.filter(room => room.id !== roomId);
    },
  },
  data: () => ({
    rooms: [],
  }),
  mounted() {
    this.$socket.client.emit('getActiveRooms');
  },
};
</script>
