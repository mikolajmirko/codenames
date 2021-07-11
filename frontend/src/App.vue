<template>
  <transition name="fade" mode="out-in">
    <Lobby v-if="room.code == null" @create-room="createRoom" @join-room="joinRoom" />
    <Game v-else :room="room" :name="name" @leave-room="leaveRoom" />
  </transition>
</template>

<script>
import Lobby from './components/Lobby.vue';
import Game from './components/Game.vue';

export default {
  name: 'App',
  components: {
    Lobby,
    Game
  },
  data() {
    return {
      room: {
        code: null
      },
      name: ''
    }
  },
  sockets: {
    roomCreated: function (data) {
      this.room = data;
    },
    roomJoined: function (data) {
      this.room = data;
    },
    unknownCode: function () {
      // TODO: Handle errors
      console.log(`Unknown room code`);
    },
    tooManyPlayers: function () {
      // TODO: Handle errors
      console.log(`Too many players`);
    },
    alreadyInRoom: function () {
      // TODO: Handle errors
      console.log(`Already in Room`);
    },
    stateUpdate: function(data) {
      this.room = data;
    },
    gameFireworks: function(data) {
      window.confetti({
        particleCount: 100,
        spread: 100,
        origin: { y: 0.7 }
      });
    }
  },
  methods: {
    createRoom: function(args) {
      this.$socket.emit('createRoom', args);
      this.name = args.name;
    },
    joinRoom: function(args) {
      this.$socket.emit('joinRoom', args);
      this.name = args.name;
    },
    leaveRoom: function(args) {
      this.$socket.emit('leaveRoom', args);
      this.room = { code: null };
    },
  }
}
</script>

<style>

  @font-face {
    font-family: 'Junegull';
    src: url('assets/junegull.ttf') format('truetype');
  }
  
  body {
    background-color: #202137;
    overflow-x: hidden;
  }

</style>