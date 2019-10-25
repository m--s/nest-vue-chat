import VueSocketIOExt from 'vue-socket.io-extended';
import io from 'socket.io-client';
import Vue from 'vue';

const socket = io(process.env.VUE_APP_WS_ADDRESS);

Vue.use(VueSocketIOExt, socket);
