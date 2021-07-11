<template>
  <button 
    @click="$emit('on-click')"
    :class="[
      'text-white font-header leading-5 border-0 rounded-lg transition duration-200 focus:outline-none text-base py-2 px-4',
      buttonColor,
    ]"
  >
    <i :class="['fas mr-2', icon || 'hidden']"></i>
    {{ label }}
  </button>
</template>

<script>
export default {
  name: 'TeamPanelButton',
  computed: {
    buttonColor() {
      if(this.team) {
        return ['btn-team-' + this.team];
      }
      return ['bg-gray-700 hover:bg-gray-800'];
    }
  },
  props: {
    label: {
      type: String,
      required: true
    },
    team: String,
    icon: String
  },
  emits: ['on-click']
}
</script>

<style scoped>
  .btn-team-red {
    background-color: #BE185D;
  }
  .btn-team-red:hover {
    background-color: #9b144a;
  }
  .btn-team-blue {
    background-color: #4F46E5;
  }
  .btn-team-blue:hover {
    background-color: #413abc;
  }
  .btn-team-spectator {
    background-color: #707f93;
  }
  .btn-team-spectator:hover {
    background-color: #515f72;
  }
</style>