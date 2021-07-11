<template>
  <div class="bg-main-300 relative p-2 sm:p-0 sm:rounded-lg w-full mt-2" style="min-height: 33rem">
    <div id="gameBoard">
      <sequential-entrance delay="100" tag="div">
        <Game-card v-for="card in board" :key="card.id" :card="card" :isRevealed="isRevealed" :canBeFlipped="canBeFlipped" @card-flipped="cardFlipped(card, ...arguments)"/>
      </sequential-entrance>
    </div>
    <transition name="fade">
      <div v-if="loading" class="absolute rounded-lg top-0 bg-black bg-opacity-50 w-full h-full text-white flex flex-col justify-center items-center">
        <i class="fas fa-spinner fa-spin fa-lg text-4xl"></i>
        <div class="mt-4">New cards incoming..</div>
      </div>
    </transition>
  </div>
</template>

<script>
import GameCard from './GameCard.vue'

export default {
  name: 'GameBoard',
  components: {
    GameCard
  },
  computed: {
    isRevealed() {
      return !this.loading && (this.gameover || (this.player.spymaster ?? false));
    },
    canBeFlipped() {
      return !this.gameover && !this.player.spymaster && this.player.team !== 'spectator';
    }
  },
  methods: {
    cardFlipped(card, event) {
      if(this.canBeFlipped) {
        if(!card.flipped) {
          this.$emit('card-flipped', card);
          const confettiColors = {
            'red': ['#DB2777', '#BE185D'],
            'blue': ['#6366F1', '#4F46E5'],
            'neutral': ['#FBBF24', '#fccd58'],
            'bomb': ['#000000','#101010','#393939'],
          }
          const rect = event.target.getBoundingClientRect();
          const xPos = (rect.left + rect.right)/2/this.$vssWidth;
          const yPos = (rect.top + rect.bottom)/2/this.$vssHeight;
          window.confetti({
            zIndex: 10,
            particleCount: 20,
            startVelocity: 16,
            ticks: 60,
            spread: 360,
            colors: confettiColors[card.type],
            origin: { x: xPos, y: yPos }
          });
        }
      }
    }
  },
  props: {
    board: {
      type: Array,
      required: true
    },
    player: {
      type: Object,
      required: true
    },
    gameover: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  emits: ['card-flipped']
}
</script>

<style>
  #gameBoard > div {
    @apply grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 p-2;
  }
</style>
