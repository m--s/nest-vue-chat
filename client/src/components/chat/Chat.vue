<template>
  <chat-window :name="name" :recipientName="recipientName" :messages="messages"
               @onSubmitMessage="submitMessage" />
</template>

<script>
import ChatWindow from './ChatWindow.vue';

export default {
  name: 'chat',
  props: {
    name: String,
    recipientName: String,
    recipientId: String,
    userType: {
      type: String,
      validator: value => (['host', 'client'].includes(value)),
    },
  },
  components: { ChatWindow },
  data: () => ({
    messages: [],
  }),
  sockets: {
    newMessage(message) {
      this.onNewMessage(message);
    },
    messages(messages) {
      messages.forEach(message => this.onNewMessage(message));
    },
  },
  methods: {
    onChatClose() {
    },
    submitMessage(message) {
      this.$socket.client.emit('sendMessage', {
        from: this.name,
        fromId: this.$socket.client.id,
        to: this.recipientId,
        text: message,
      });
    },
    onNewMessage(message) {
      if (!this.shouldRenderMessage(message)) {
        return;
      }

      let orientation = 'left';
      if (message.from === this.name) {
        orientation = 'right';
      }

      this.messages = [...this.messages, { text: message.text, name: message.from, orientation }];
    },
    connect() {
      this.$socket.client.emit('userConnected', { name: this.name, userType: this.userType });
    },
    getArchiveMessages() {
      if (this.recipientId) {
        this.$socket.client.emit('getMessages', this.recipientId);
      }
    },
    shouldRenderMessage(message) {
      if (this.recipientId) {
        if (message.fromId !== this.recipientId && message.to !== this.recipientId) {
          return false;
        }
      }
      return true;
    },
  },
  mounted() {
    this.connect();
    this.getArchiveMessages();
  },
};
</script>
<style lang="scss" scoped>

  .messages-container {
    background-color: #F5F5F5;
    height: 230px;
    overflow-x: hidden;
  }

</style>
