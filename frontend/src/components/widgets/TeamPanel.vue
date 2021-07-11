<template>
  <div :class="['rounded-lg w-full mb-4', bgColor]">
    <h2 class="w-full font-header text-white text-lg flex justify-between items-center px-4 pb-0 py-2 pr-2">
      <span>{{ header }}</span>
      <Team-panel-button v-if="player.team != team" @on-click="joinTeam(team)" :team="team" label="Join" icon="fa-plus" />
    </h2>
    <div class="px-4 py-2 pl-2 text-white">
      <ul v-for="player in players" :key="player.id">
        <li class="flex items-center flex-nowrap py-1 rounded-lg">
          <span class="w-10 text-center flex-shrink-0 text-xl">
            <i 
              :key="player.spymaster ? 'spymaster' : 'operative'"
              :class="['fas', player.spymaster ? 'fa-bullhorn' : player.team !== 'spectator' ? 'fa-user-secret' : 'fa-user']"
            ></i>
          </span>
          <span class="truncate">{{ player.name }}</span>
        </li>
      </ul>
      <p v-if="players.length === 0" class="text-center text-gray-100 pt-3 pb-2">
        {{ team == 'spectator' ? 'More players can join at anytime' : 'There is no one here 😔' }}</p>
    </div>
    <div class="flex flex-col mb-4 pb-2 px-2">
      <Team-panel-button v-if="team != 'spectator' && player.team == team && !player.spymaster" :team="team" @on-click="setSpymaster(true)" label="Become Spymaster" icon="fa-bullhorn" />
      <Team-panel-button v-if="team != 'spectator' && player.team == team && player.spymaster" :team="team" @on-click="setSpymaster(false)" label="Become Operative" icon="fa-user-secret" />
    </div>
  </div>
</template>

<script>
import TeamPanelButton from './TeamPanelButton.vue';

export default {
  name: 'TeamPanel',
  components: {
    TeamPanelButton,
  },
  methods: {
    joinTeam(team) {
      this.$emit('join-team', team);
    },
    setSpymaster(spymaster) {
      this.$emit('set-spymaster', spymaster);
    }
  },
  computed: {
    bgColor: function() {
      if(this.team == 'red') {
        return 'bg-team-red'; 
      }
      if(this.team == 'blue') {
        return 'bg-team-blue'; 
      }
      if(this.team == 'spectator') {
        return 'bg-team-spectator'; 
      }
    }
  },
  props: {
    team: {
      type: String,
      default: 'spectator'
    },
    header: {
      type: String,
      required: true
    },
    players: Array,
    player: Object
  },
  emits: ['join-team', 'set-spymaster']
}
</script>
