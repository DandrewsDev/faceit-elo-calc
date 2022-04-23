<script setup>
import axios from 'axios'
import { ref } from 'vue'

let matchPage = true
const players = []

const teamOneElo = ref(0)
const teamTwoElo = ref(0)

const teamOneEloGain = ref(0)
const teamOneEloLoss = ref(0)
const teamTwoEloGain = ref(0)
const teamTwoEloLoss = ref(0)

const refreshMatch = ref(() => {})
const completedStatus = ref(['FINISHED', 'CANCELED', 'LIVE'])

async function getPlayerList() {
  const currentURL = window.location.pathname
  let matchId = ''
  if (currentURL.includes('/en/csgo/room'))
    matchId = currentURL.split('room/')[1]
  else
    matchPage = false

  try {
    const json = await axios(`https://open.faceit.com/data/v4/matches/${matchId}`, {
      headers: {
        Authorization: 'Bearer ',
      },
    })

    const response = json.data

    if (!completedStatus.value.includes(response.status))
      refreshMatch.value = setInterval(() => { getPlayerList() }, 3000)
    else if (completedStatus.value.includes(response.status))
      clearInterval(refreshMatch.value)

    const teamOne = response.teams.faction1.roster
    const teamTwo = response.teams.faction2.roster
    teamOne.forEach((playerData) => {
      getPlayerElo(playerData.player_id, 1)
      players.push(playerData.player_id)
    })
    teamTwo.forEach((playerData) => {
      getPlayerElo(playerData.player_id, 2)
      players.push(playerData.player_id)
    })
  }
  catch (e) {
    // eslint-disable-next-line no-console
    console.log(e)
  }
}

async function getPlayerElo(player_id, team) {
  try {
    const json = await axios(`https://open.faceit.com/data/v4/players/${player_id}`, {
      headers: {
        Authorization: 'Bearer 98e30890-7901-4303-98ee-e21a8216f845',
      },
    })

    const response = json.data

    if (team === 1)
      teamOneElo.value += response.games.csgo.faceit_elo
    if (team === 2)
      teamTwoElo.value += response.games.csgo.faceit_elo
  }
  catch (e) {
    // eslint-disable-next-line no-console
    console.log(e)
  }
}

function estimateRatingChange(elo1, elo2, K = 50) {
  const eloDiff = elo2 - elo1
  const percentage = 1 / (1 + Math.pow(10, eloDiff / 400))

  const gain = Math.round(K * (1 - percentage))
  const loss = Math.round(K * (0 - percentage))

  return {
    gain: gain || 1,
    loss: loss || -1,
  }
}

function setGainLoss() {
  const teamOneInfo = estimateRatingChange(teamOneElo.value / 5, teamTwoElo.value / 5)
  teamOneEloGain.value = Math.abs(teamOneInfo.gain)
  teamOneEloLoss.value = Math.abs(teamOneInfo.loss)
  teamTwoEloGain.value = Math.abs(teamOneInfo.loss)
  teamTwoEloLoss.value = Math.abs(teamOneInfo.gain)
}

onMounted(() => {
  getPlayerList()
})
watch(teamOneElo, () => {
  setGainLoss()
})
watch(teamTwoElo, () => {
  setGainLoss()
})
</script>

<template>
  <div class="elo_calc_parent">
    <div id="team_one_elo_info" class="team_elo_display team_one">
      Elo Gain: {{ teamOneEloGain }} | Elo Loss: {{ teamOneEloLoss }}
    </div>
    <div id="team_two_elo_info" class="team_elo_display team_two">
      Elo Gain: {{ teamTwoEloGain }} | Elo Loss: {{ teamTwoEloLoss }}
    </div>
  </div>
</template>

<style>
.team_elo_display {
  width: 40%;
  display: inline-block;
}
.team_two {
  text-align: right;
  margin-right: 5%;
}
.team_one {
  margin-left: 8%;
}
.elo_calc_parent {
  padding-top: .5em
}
</style>
