<template>
  <v-card width="320px" class="ma-2" dense>
    <chat-toolbar :name="recipientName" @onClose="onChatClose"></chat-toolbar>

    <v-list class="overflow-y-auto messages-container pa-2" ref='messagesContainer'>
      <chat-message v-for="(msg, i) in messages"
                    v-bind:key="i"
                    :text="msg.text" :name="msg.name" :orientation="msg.orientation"/>
    </v-list>

    <v-card-actions>
      <v-textarea
        v-model="newMessage"
        @keyup.enter.exact="submitMessage"
        ref="messageInput"
        no-resize solo flat placeholder="Type here..." rows="1"></v-textarea>
      <v-btn class="pa-1" icon @click="submitMessage">
        <v-icon>mdi-send</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>

</template>

<script>
import ChatToolbar from './ChatToolbar.vue';
import ChatMessage from './ChatMessage.vue';

export default {
  props: {
    name: String,
    recipientName: String,
    messages: {
      default: [],
    },
  },
  components: { ChatToolbar, ChatMessage },
  data: () => ({
    newMessage: '',
  }),
  methods: {
    onChatClose() {
      this.$emit('onChatClose');
    },
    scrollMessagesToBottom() {
      const { messagesContainer } = this.$refs;
      messagesContainer.$el.scrollTop = messagesContainer.$el.scrollHeight;
    },
    submitMessage() {
      if (this.newMessage.trim().length === 0) {
        return;
      }

      const message = this.newMessage.toString();
      this.$emit('onSubmitMessage', message);
      this.newMessage = '';
    },
  },
  updated() {
    this.scrollMessagesToBottom();
  },
  mounted() {
    const { messageInput } = this.$refs;
    messageInput.focus();
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
