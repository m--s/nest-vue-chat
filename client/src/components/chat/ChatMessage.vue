<template>
  <div>
    <v-row v-if="orientation === 'left'">
      <v-col cols="2">
        <v-avatar size="36px" color="primary">
          <span class="white--text headline">{{avatar}}</span>
        </v-avatar>
      </v-col>
      <v-col cols="10">
        <span class="message-bubble message-bubble--left">{{text}}</span>
      </v-col>
    </v-row>
    <v-row v-if="orientation === 'right'">
      <v-col cols="10">
        <span class="message-bubble message-bubble--right">{{text}}</span>
      </v-col>
      <v-col cols="2">
        <v-avatar size="36px" color="primary">
          <span class="white--text headline">{{avatar}}</span>
        </v-avatar>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: 'chat-message',
  props: {
    name: String,
    text: String,
    orientation: {
      type: String,
      validator: value => (['left', 'right'].includes(value)),
    },
  },
  computed: {
    avatar() {
      return this.name.substr(0, 1);
    },
  },
};
</script>
<style lang="scss" scoped>
  .messages-container {
    background-color: #F5F5F5;
  }

  .message-bubble {
    display: inline-block;
    padding: 10px 18px;
    position: relative;
    width: 100%;
    box-shadow: -1px 1px 1px 0 rgba(0, 0, 0, 0.1);

    &::before {
      content: "";
      height: 16px;
      position: absolute;
      top: 0;
      border-radius: 3px;
      width: 15px;
      z-index: 1;
    }
  }

  .message-bubble--left {
    border-radius: 0 6px 6px 6px;
    background: #1976d2;
    color: #ffff;
    &::before {
      background: #1976d2;
      left: -3px;
      transform: skew(45deg);
    }
  }

  .message-bubble--right {
    border-radius: 6px 0 6px 6px;
    background: #ffff;
    &::before {
      background: #ffff;
      right: -3px;
      transform: skew(-45deg);
    }
  }
</style>
