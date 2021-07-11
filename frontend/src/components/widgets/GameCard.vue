<template>
  <div class="scene" @click="cardFlipped">
    <div :class="['card', card.flipped ? 'rotateY' : '']">
      <div :class="['card__face', notFlippedColor]"><div>{{ card.word }}</div></div>
      <div :class="['card__face rotateY', flippedColor]"><div>{{ card.word }}</div></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GameCard',
  methods: {
    cardFlipped(event) {
      this.$emit('card-flipped', event);
    }
  },
  computed: {
    notFlippedColor() {
      if(this.isRevealed) {
        if(this.card.type === 'red') {
          return ['border-team-red bg-red-200 text-gray-800 border-4'];
        }
        if(this.card.type == 'blue') {
          return ['border-team-blue bg-blue-200 text-gray-800 border-4'];
        }
        if(this.card.type == 'neutral') {
          return ['border-amber-300 bg-amber-100 text-gray-800 border-4'];
        }
        if(this.card.type == 'bomb') {
          return ['border-gray-800 bg-gray-400 text-gray-800 border-4'];
        }
      }
      return [
        'bg-main-100 border-main-100 border-4 text-white transform',
        this.canBeFlipped ? 'cursor-pointer hover:bg-main-200 hover:border-main-200 hover:scale-105' : ''
      ];
    },
    flippedColor() {
      if(this.card.type === 'red') {
        return ['bg-team-red text-white border-team-red border-4'];
      }
      if(this.card.type == 'blue') {
        return ['bg-team-blue text-white border-team-blue border-4'];
      }
      if(this.card.type == 'neutral') {
        return ['bg-amber-400 text-white border-amber-400 border-4'];
      }
      if(this.card.type == 'bomb') {
        return ['bg-gray-800 text-white border-gray-800 border-4'];
      }
    }
  },
  props: {
    card: {
      type: Object,
      required: true
    },
    canBeFlipped: {
      type: Boolean,
      default: false
    },
    isRevealed: {
      type: Boolean,
      default: false
    }
  },
  emits: ['card-flipped']
}
</script>

<style scoped>

  /* Flipping card transition */

  .scene {
    @apply w-full h-24 select-none;
    perspective: 600px;
  }

  .card {
    @apply relative w-full h-full;
    transition: transform 0.6s ease;
    transform-style: preserve-3d;
  }

  .card__face {
    @apply absolute w-full h-full p-1 rounded-lg tracking-wider text-lg border-collapse font-header transition flex items-center;
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
  }

  .card__face > div {
    @apply w-full text-center break-words;
    word-wrap: break-word;
    hyphens: auto;
  }

  .rotateY {
    transform: rotateY(180deg);
  }

</style>