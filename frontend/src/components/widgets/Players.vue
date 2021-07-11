<template>
  <div class="flex sm:my-6 w-full min-max-tab h-full sm:h-auto">
    <div class="bg-main-100 w-full sm:w-80 xl:w-full flex flex-col">
      <h2 class="w-full font-header text-white text-2xl px-6 pr-4 py-4 flex items-center justify-end">
        Players
      </h2>
      <div class="px-4 overflow-y-auto flex-grow">
        <Team-panel team="red" header="Rose team" :players="playersRed" @join-team="joinTeam" @set-spymaster="setSpymaster" :player="player"/>
        <Team-panel team="blue" header="Indigo team" :players="playersBlue" @join-team="joinTeam" @set-spymaster="setSpymaster" :player="player"/>
        <Team-panel header="Spectators" :players="playersSpectator" @join-team="joinTeam" :player="player"/>
      </div>
    </div>
    <div :class="['bg-main-300 sm:rounded-r-lg font-header text-white text-2xl p-4 w-16 flex flex-col justify-between', clickable]" @click="togglePlayersTab()">
      <Panel-icon icon="fa-user-friends" margin="mt-1" :showBadge="showPlayersBadge" :isTabOpen="isPlayersOpen" @set-badge="setPlayersBadge" />  
      <i class="fas fa-times w-8 sm:hidden text-center mb-1"></i>
    </div>
  </div>
</template>

<script>
import TeamPanel from './TeamPanel.vue';
import PanelIcon from './../layout/PanelIcon.vue';

export default {
  name: 'Players',
  components: {
    TeamPanel,
    PanelIcon
  },
  methods: {
    playersFilter(team) {
      return this.room ? this.room.players.filter((player) => player.team == team) : [];
    },
    joinTeam(team) {
      this.$socket.emit('joinTeam', { roomCode: this.room.code, player: this.player, team: team });
    },
    setSpymaster(spymaster) {
      this.$socket.emit('setSpymaster', { roomCode: this.room.code, player: this.player, spymaster: spymaster });
    },
    togglePlayersTab() {
      this.$emit('toggle-players-tab');
    },
    setPlayersBadge(value) {
      this.$emit('set-players-badge', value);
    },
  },
  computed: {
    playersRed: function() { return this.playersFilter('red') },
    playersBlue: function() { return this.playersFilter('blue') },
    playersSpectator: function() { return this.playersFilter('spectator') },
    clickable: function() { return this.$vssWidth < 1280 ? 'cursor-pointer' : ''}
  },
  props: {
    room: {
      type: Object,
      required: true
    },
    player: {
      type: Object,
      required: true
    },
    showPlayersBadge: {
      type: Boolean,
      required: true
    },
    isPlayersOpen: {
      type: Boolean,
      required: true
    }
  },
  emits: ['toggle-players-tab', 'set-players-badge']
}
</script>
