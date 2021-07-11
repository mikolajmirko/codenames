<template>
  <div class="flex justify-between sm:hidden pb-2">
        <div :class="[buttonStyle, 'rounded-r-lg mr-2 pl-8']" @click="togglePlayersTab()">
            Players
            <Panel-icon icon="fa-user-friends" margin="ml-3 mt-1" :showBadge="showPlayersBadge" :isTabOpen="isPlayersOpen" @set-badge="setPlayersBadge" />
        </div>
        <div :class="[buttonStyle, 'rounded-l-lg ml-2 pr-8']" @click="toggleChatTab()">
            <Panel-icon icon="fa-comment-alt" margin="mr-2 mt-1" :showBadge="showChatBadge" :isTabOpen="isChatOpen" @set-badge="setChatBadge" />
            Chat
        </div>
  </div>
</template>

<script>
import PanelIcon from './../layout/PanelIcon.vue';

export default {
  name: 'MobileButtons',
  components: {
    PanelIcon
  },
  methods: {
    toggleChatTab() {
      this.$emit('toggle-chat-tab');
    },
    togglePlayersTab() {
      this.$emit('toggle-players-tab');
    },
    setChatBadge(value) {
      this.$emit('set-chat-badge', value);
    },
    setPlayersBadge(value) {
      this.$emit('set-players-badge', value);
    }
  },
  computed: {
    buttonStyle: function() { return 'bg-main-300 text-white text-2xl font-header cursor-pointer p-3 px-6' }
  },
  props: {
    showPlayersBadge: {
      type: Boolean,
      required: true
    },
    showChatBadge: {
      type: Boolean,
      required: true
    },
    isPlayersOpen: {
      type: Boolean,
      required: false
    },
    isChatOpen: {
      type: Boolean,
      required: false
    }
  },
  emits: ['toggle-players-tab', 'toggle-chat-tab', 'set-players-badge', 'set-chat-badge']
}
</script>
