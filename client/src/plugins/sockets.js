import VueSocketIOExt from 'vue-socket.io-extended';
import io from 'socket.io-client';
import Vue from 'vue';

const socket = io('localhost:3000');

Vue.use(VueSocketIOExt, socket);
