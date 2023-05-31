<script setup>
import { ref } from 'vue'
import CloseIcon from 'vue-material-design-icons/Close.vue'
import imgUrl from '../../assets/elo-refresh.png'
import PlayerLeetStats from '../../components/PlayerLeetifyStats.vue'
import { enablePlayerElo, enablePlayerLeetify } from '~/logic/storage'

const players = ref([])
const teamOneElo = ref(0)
const teamTwoElo = ref(0)

const teamOneEloGain = ref(0)
const teamOneEloLoss = ref(0)
const teamTwoEloGain = ref(0)
const teamTwoEloLoss = ref(0)
const autoRefreshCount = ref(0)
const refreshMatch = ref(setInterval(() => {
  autoRefreshCount.value += 1
  getPlayerList()
  if (autoRefreshCount.value > 150)
    clearInterval(refreshMatch.value)
}, 2500))

const completedStatus = ref(['ONGOING', 'READY', 'CANCELED', 'FINISHED'])

const showLeetStatsPlayer = ref({})

async function getPlayerList() {
  players.value = []
  teamOneElo.value = 0
  teamTwoElo.value = 0
  const currentURL = window.location.pathname
  let matchId = ''
  const regx = /\/[a-z]{2}\/csgo\/room/g

  if (currentURL.match(regx))
    matchId = currentURL.split('room/')[1]
  else
    return

  try {
    let json = await fetch(`https://api.faceit.com/match/v2/match/${matchId}`, {
      method: 'GET',
      headers: new Headers({
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    })

    json = await json.json()
    const response = json.payload
    if (completedStatus.value.includes(response.status) || (response.voting && response.voting.location && response.voting.location.pick && response.voting.location.pick.length > 0))
      clearInterval(refreshMatch.value)

    const teamOne = response.teams.faction1.roster
    const teamTwo = response.teams.faction2.roster
    teamOne.forEach((playerData) => {
      getPlayerElo(playerData.id, 1)
      playerData.statsDisplay = false
      players.value.push(playerData)
    })
    teamTwo.forEach((playerData) => {
      getPlayerElo(playerData.id, 2)
      playerData.statsDisplay = false
      players.value.push(playerData)
    })
  }
  catch (e) {
    // eslint-disable-next-line no-console
    console.log(e)
  }
}

function addPlayerElo() {
  // Check settings, only display if enabled.
  // This also does not update on refresh, it's not needed and would be a performance hit.
  if (enablePlayerElo.value === false && enablePlayerLeetify.value === false)
    return

  // Limit starting list of elements.
  const elements = document.querySelector('#parasite-container').querySelector('#MATCHROOM-OVERVIEW').children
  const rosterOne = elements[3].children.roster1.querySelectorAll('div')
  const rosterTwo = elements[3].children.roster2.querySelectorAll('div')
  const prePickRoster = elements[3].children.info.querySelectorAll('div')
  const playerNameDivs = [...rosterOne, ...rosterTwo, ...prePickRoster]
  for (let j = 0; j < players.value.length; j++) {
    const playerData = players.value[j]
    for (let i = 0; i < playerNameDivs.length; i++) {
      if (playerNameDivs[i].innerText === playerData.nickname
          && playerNameDivs[i].getAttribute('class')
          && playerNameDivs[i].getAttribute('class').match(/.* .* .* .*/gm)
          && !playerNameDivs[i].innerText.match(/\([0-9].{2,3}\)/gm)
          && !playerNameDivs[i].innerText.includes('(')
          && !playerNameDivs[i].innerText.includes(')')) {
        if (enablePlayerLeetify.value) {
          playerNameDivs[i].parentElement.addEventListener('mouseover', () => {
            showLeetStatsPlayer.value = playerData
          }, false)
          playerNameDivs[i].parentElement.addEventListener('mouseleave', () => {
            showLeetStatsPlayer.value = {}
          }, false)
        }
        if (enablePlayerElo.value) {
          playerNameDivs[i].insertAdjacentText('beforeend', ` (${playerData.elo})`)
          j++
        }
        break
      }
    }
  }
}

async function getPlayerElo(player_id, team) {
  try {
    let json = await fetch(`https://api.faceit.com/users/v1/users/${player_id}`, {
      method: 'GET',
      headers: new Headers({
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    })

    json = await json.json()
    const response = json.payload

    if (team === 1)
      teamOneElo.value += response.games.csgo.faceit_elo
    if (team === 2)
      teamTwoElo.value += response.games.csgo.faceit_elo

    if (players.value.length === 10) {
      setGainLoss()
      addPlayerElo()
    }
  }
  catch (e) {
    // eslint-disable-next-line no-console
    console.log(e)
  }
}

function estimateRatingChange(elo1, elo2, K = 50) {
  const eloDiff = elo2 - elo1
  const percentage = 1 / (1 + 10 ** (eloDiff / 400))

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
function refreshEloCalc() {
  getPlayerList()
}
onMounted(() => {
  getPlayerList()
})
</script>

<template>
  <div class="elo_calc_parent">
    <img class="elo_calc_refresh" :src="imgUrl" alt="calculate elo" @click="refreshEloCalc">
    <div id="team_one_elo_info" class="team_elo_display team_one">
      Elo Gain: <span class="gain"> {{ teamOneEloGain }} </span> | Elo Loss: <span class="loss"> {{ teamOneEloLoss }} </span>
    </div>
    <div id="team_two_elo_info" class="team_elo_display team_two">
      Elo Gain: <span class="gain"> {{ teamTwoEloGain }} </span> | Elo Loss: <span class="loss"> {{ teamTwoEloLoss }} </span>
    </div>
    <div v-if="showLeetStatsPlayer.hasOwnProperty('gameId')" class="mps_pop_over_window">
      <div @click="showLeetStatsPlayer = {}">
        <CloseIcon />
      </div>
      {{ showLeetStatsPlayer.nickname }}
      <PlayerLeetStats id="playerLeetStatsWindow" ref="playerLeetStats" :player-data="showLeetStatsPlayer" />
    </div>
  </div>
</template>

<style>
.gain {
  color: #03a403;
}
.loss {
  color: red;
}
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
.elo_calc_refresh {
  height: 35px;
  width: 35px;
  fill: white;
}
.mps_pop_over_window {
  background-color: #181818;
  width: 410px;
  position: fixed;
  bottom: 80px;
  right: 16px;
  height: 450px;
  z-index: 4000;
  border-radius: 2px;
  box-shadow: 0 4px 12px 0 rgba(0,0,0,0.75);
  overflow: auto;
}
</style>
