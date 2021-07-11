<template>
  <header class="p-4 pb-0 sm:p-0">
    <Popup
      v-show="invitePopupOpen"
      title="Invite players"
      @close-popup="invitePopupClose()"
    >
      <p>Share the code below with your friends</p>
      <div class="flex flex-nowrap items-center rounded-lg bg-main-200 my-2 pr-1">
        <span class="text-white bg-main-300 p-4 py-3 rounded-l-lg"><i class="fas fa-hashtag"></i></span>
        <input type="text" v-model="room.code" readonly="true" ref="nameField" class="border-0 py-2 px-3 text-white w-full focus:outline-none bg-transparent" maxlength="8" minlength="8">
        <CopyToClipboard :text="room.code">
          <button title="Random name" @click="invitePopupClose()" class="focus:outline-none rounded-lg bg-main-300 hover:bg-main-100 text-white text-lg px-4 h-10 flex items-center justify-center mr-0.5">
            <i class="fas fa-clipboard mr-3"></i> Copy
          </button>
        </CopyToClipboard>
      </div>
    </Popup>
    <div class="w-full px-6 pt-4 pb-10 rounded-lg sm:rounded-t-none bg-main-100">
      <div class="flex flex-row justify-between items-center mb-2">
        <h1 class="text-4xl sm:text-5xl font-header w-full text-white">
          <img :src="`${publicPath}logo.png`" class="w-10 h-10 mr-2 hidden sm:inline-block"> CodeNames
        </h1>
        <div class="relative">
          <button v-on:click="settingsOpen = !settingsOpen" class="focus:outline-none rounded-lg bg-main-300 hover:bg-main-200 text-white text-2xl w-12 h-12 flex items-center justify-center">
            <transition name="fade" mode="out-in">
              <i v-if="settingsOpen" key="closedSettingsIcon" class="fas fa-times"></i>
              <i v-else key="openSettingsIcon" class="fas fa-cog"></i>
            </transition>
          </button>
          <transition name="slide-fade">
            <div class="absolute bg-white overflow-hidden rounded-lg right-0 mt-2 z-50 w-56 text-right" v-if="settingsOpen">
              <div class="flex items-center py-3 px-4 cursor-pointer hover:bg-gray-100 border-b border-gray-300" @click="invitePopup()" >
                <i class="fas mr-4 fa-user-plus"></i>
                <span>Invite players</span>
              </div>
              <div class="flex items-center py-3 px-4 cursor-pointer hover:bg-gray-100 border-b border-gray-300" @click="newGameBoard()" >
                <i class="fas mr-4 fa-sync"></i>
                <span>New board</span>
              </div>
              <div class="flex items-center py-3 px-4 cursor-pointer hover:bg-gray-100" @click="leaveRoom()" >
                <i class="fas mr-4 fa-arrow-right"></i>
                <span>Leave room</span>
              </div>
            </div>
          </transition>
        </div>
      </div>
      <p class="text-gray-200" v-html="welcomeMessage"></p>
    </div>
    <div class="w-64 text-white font-header text-lg -mt-10 mx-auto flex p-4">
      <div class="bg-team-red rounded-l-full w-1/2 py-2 px-4 flex items-center">
        <i class="fas fa-clone mr-4"></i>
        <transition :name="room.loading ? '' : 'slide-fade'" mode="out-in">
          <div :key="cardsRed">{{ cardsRed }}</div>
        </transition>
      </div>
      <div class="bg-team-blue rounded-r-full w-1/2 py-2 px-4 flex items-center justify-end">
        <transition :name="room.loading ? '' : 'slide-fade'" mode="out-in">
          <div :key="cardsBlue">{{ cardsBlue }}</div>
        </transition>
        <i class="fas fa-clone ml-4 fa-flip-horizontal"></i>
      </div>
    </div>
  </header>
</template>

<script>
import CopyToClipboard from 'vue-copy-to-clipboard';
import Popup from '../widgets/Popup.vue';

export default {
  name: 'Header',
  components: {
    Popup,
    CopyToClipboard
  },
  data() {
    return {
      publicPath: process.env.BASE_URL,
      settingsOpen: false,
      invitePopupOpen: false
    }
  },
  methods: {
    invitePopup() {
      this.settingsOpen = false;
      this.invitePopupOpen = true;
    },
    invitePopupClose() {
      this.invitePopupOpen = false;
    },
    leaveRoom() {
      this.settingsOpen = false;
      this.$emit('leave-room', { name: this.playerName, roomCode: this.room.code });
    },
    newGameBoard() {
      this.settingsOpen = false;
      this.$socket.emit('flipBoard', { roomCode: this.room.code });
      setTimeout(() => { 
        this.$socket.emit('emptyBoard', { roomCode: this.room.code });
        setTimeout(() => { 
          this.$socket.emit('newGameBoard', { roomCode: this.room.code })
        }, 100);
      }, 800);
    }
  },
  computed: {
    welcomeMessage: function() {
      if(!this.player)
        return "";
      let html = `Hello <strong class="text-team-${this.player.team}">${this.player.name}</strong>, you are `;
      if(this.player.team == 'spectator') {
        html += 'spectating the game, join a team to start playing 🎮';
      } else {
        if(this.player.spymaster)
          html += ' a 📣 spymaster - give clues to help your team find all the agents'
        else
          html += ' an 🕵️ operative - use the given clues to find all your agents'
      }
      return html;
    }
  },
  props: {
    room: Object,
    player: Object,
    cardsRed: String,
    cardsBlue: String
  },
  emits: ['leave-room']
}
</script>