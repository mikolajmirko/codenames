<template>
  <div>
    <div class="xl:flex">
      <div :class="['xl:w-1/4 xl:flex-shrink-0', tabHidden, tabPlayersLogic]">
        <Players
          :room="room"
          :player="player"
          :showPlayersBadge="playersBadge"
          :isPlayersOpen="playersOpen"
          @set-players-badge="setPlayersBadge"
          @toggle-players-tab="openPlayersTab()"
        />
      </div>
      <div :class="['xl:flex-grow xl:px-6 sm:px-20']">
        <Header
          :room="room"
          :player="player"
          :cardsRed="cardCountDisplay('red')"
          :cardsBlue="cardCountDisplay('blue')"
          @leave-room="leaveRoom"
        />
        <Mobile-buttons 
          :showPlayersBadge="playersBadge"
          :showChatBadge="chatBadge"
          :isPlayersOpen="playersOpen"
          :isChatOpen="chatOpen"
          @set-players-badge="setPlayersBadge"
          @set-chat-badge="setChatBadge"
          @toggle-players-tab="openPlayersTab()"
          @toggle-chat-tab="openChatTab()"
        />
        <Game-board
          :board="board"
          :player="player"
          @card-flipped="cardFlipped"
          :gameover="room.gameover"
          :loading="room.loading"
        />
        <Footer />
      </div>
      <div :class="['xl:w-1/4 xl:flex-shrink-0', tabHidden, tabChatLogic]">
        <Chat
          :room="room"
          :player="player"
          :showChatBadge="chatBadge"
          :isChatOpen="chatOpen"
          @set-chat-badge="setChatBadge"
          @toggle-chat-tab="openChatTab()"
        />
      </div>
    </div>
    <transition name="fade">
      <div
        v-if="playersOpen || chatOpen"
        @click="playersOpen = false; chatOpen = false;"
        class="fixed top-0 left-0 w-screen h-screen z-50 bg-main-300 bg-opacity-70">
      </div>
    </transition>
  </div>
</template>

<script>
import Header from './layout/Header.vue';
import Footer from './layout/Footer.vue';
import Players from './widgets/Players.vue';
import MobileButtons from './widgets/MobileButtons.vue';
import GameBoard from './widgets/GameBoard.vue';
import Chat from './widgets/Chat.vue';

export default {
  name: 'Game',
  components: {
    Header,
    Footer,
    Players,
    MobileButtons,
    GameBoard,
    Chat
  },
  data() {
    return {
      playersOpen: false,
      playersBadge: false,
      chatOpen: false,
      chatBadge: false
    };
  },
  created() {
    this.recalculateViewport();
    window.addEventListener("resize", this.windowResized);
    document.addEventListener("backbutton",this.onBackButton);
  },
  destroyed() {
    window.removeEventListener("resize", this.windowResized);
    document.removeEventListener("backbutton", this.onBackButton);
  },
  methods: {
    recalculateViewport() {
      // Mobile viewport fix
      let vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    },
    windowResized(e) {
      if(this.$vssWidth > 1280) {
        this.playersOpen = false;
        this.chatOpen = false;
      }
      this.recalculateViewport();
    },
    onBackButton() {
      if(this.playersOpen || this.chatOpen) {
        this.playersOpen = false;
        this.chatOpen = false;
        return false;
      } else {
        navigator.app.exitApp();
      }
    },
    leaveRoom() {
      this.$emit('leave-room', { name: this.name, roomCode: this.room.code });
    },
    cardFlipped(card) {
      this.$socket.emit('cardFlipped', { roomCode: this.room.code, player: this.player, card: card });
    },
    cardCountDisplay(team) {
      if(this.board === [])
        return '0 / 0';
      return this.board.filter((card) => card.type === team && card.flipped).length + ' / ' 
      + this.board.filter((card) => card.type === team).length;
    },
    openPlayersTab() {
      if(this.$vssWidth < 1280) {
        this.chatOpen = false;
        this.playersOpen = !this.playersOpen;
        this.playersBadge = false;
      }
    },
    openChatTab() {
      if(this.$vssWidth < 1280) {
        this.playersOpen = false;
        this.chatOpen = !this.chatOpen;
        this.chatBadge = false;
      }
    },
    setPlayersBadge(value) {
      this.playersBadge = value;
    },
    setChatBadge(value) {
      this.chatBadge = value;
    }
  },
  computed: {
    player: function() { return this.room.players.find((player) => player.id == this.$socket.id)},
    board: function() { return this.room.board ?? [] },
    tabHidden: function() { 
      return this.$vssWidth < 1280 ? 'fixed tab h-screen-fixed top-0 ' + (this.$vssWidth < 640 ? 'w-full' : '') : '';
    },
    tabPlayersLogic: function() {
      if(!this.playersOpen) {
        if(this.$vssWidth < 640)
          return 'left-tab-full';
        if(this.$vssWidth < 1280)
          return 'left-tab';
      } else {
        if(this.$vssWidth < 1280)
          return 'left-0 z-60';
      }
      return '';
    },
    tabChatLogic: function() {
      if(!this.chatOpen) {
        if(this.$vssWidth < 640)
          return 'right-tab-full';
        if(this.$vssWidth < 1280)
          return 'right-tab';
      } else {
        if(this.$vssWidth < 1280)
          return 'right-0 z-60';
      }
      return '';
    },
  },
  props: {
    room: Object,
    name: String
  },
  emits: ['leave-room']
}
</script>

<style scoped>

  .h-screen-fixed {
    height: 100vh;
    height: calc(var(--vh, 1vh) * 100);
  }

  .tab {
    transition: left 0.3s ease-in-out, right 0.3s ease-in-out, top 0.3s ease-in-out;
    min-width: 24rem;
    z-index: 55;
  }
  
  .left-tab {
    left: -20rem;
  }

  .left-tab-full {
    left: -100vw;
  }

  .right-tab {
    right: -20rem;
  }

  .right-tab-full {
    right: -100vw;
  }

</style>