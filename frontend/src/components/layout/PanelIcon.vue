<template>
    <i :class="['fas w-8 relative text-white text-2xl', icon, margin]">
        <transition name="fade">
            <span class="flex h-4 w-4 absolute justify-center items-center bottom-0 -right-1 xl:hidden" v-show="showBadge">
                <span class="absolute inline-flex h-full w-full rounded-full bg-red-600 opacity-50" :class="[badgeAnimation ? 'animate-ping' : 'hidden']"></span>
                <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600"></span>
            </span>
        </transition>
    </i>
</template>

<script>
export default {
  name: 'PanelIcon',
  data() {
    return {
      badgeAnimation: false
    };
  },
  sockets: {
    playersChange: function() {
      if(this.icon == 'fa-user-friends' && !this.isTabOpen) {
        this.$emit('set-badge', true);
        this.badgeAnimation = true;
        setTimeout(() => { this.badgeAnimation = false }, 1000);
      }
    },
    chatMessage: function() {
      if(this.icon == 'fa-comment-alt' && !this.isTabOpen) {
        this.$emit('set-badge', true);
        this.badgeAnimation = true;
        setTimeout(() => { this.badgeAnimation = false }, 1000);
      }
    }
  },
  props: {
    icon: {
      type: String,
      required: true
    },
    margin: {
      type: String,
      default: ''
    },
    showBadge: {
      type: Boolean,
      default: false
    },
    isTabOpen: {
      type: Boolean,
      default: false
    }
  },
  emits: ['set-badge']
}
</script>
