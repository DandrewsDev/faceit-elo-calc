<script setup>
import { ref } from 'vue'
import imgUrl from '../../assets/elo-refresh.png'
import { enablePlayerElo } from '~/logic/storage'

let matchPage = true
const players = ref([])
const teamOneElo = ref(0)
const teamTwoElo = ref(0)

const teamOneEloGain = ref(0)
const teamOneEloLoss = ref(0)
const teamTwoEloGain = ref(0)
const teamTwoEloLoss = ref(0)

const refreshMatch = ref(setInterval(() => { getPlayerList() }, 2500))
const completedStatus = ref(['ONGOING', 'READY', 'CANCELED', 'FINISHED', 'LIVE'])

async function getPlayerList() {
  players.value = []
  teamOneElo.value = 0
  teamTwoElo.value = 0
  const currentURL = window.location.pathname
  let matchId = ''
  const regx = /\/[a-z]{2}\/csgo\/room/g;

  //if (currentURL.includes('/en/csgo/room'))
  if (currentURL.match(regx)) {
    matchId = currentURL.split('room/')[1]
  else
    matchPage = false

  try {
    let json = await fetch(`https://api.faceit.com/match/v2/match/${matchId}`, {
      method: 'GET',
      headers: new Headers({
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    })

    json = await json.json()
    const response = json.payload
    if (completedStatus.value.includes(response.status))
      clearInterval(refreshMatch.value)

    const teamOne = response.teams.faction1.roster
    const teamTwo = response.teams.faction2.roster
    teamOne.forEach((playerData) => {
      getPlayerElo(playerData.id, 1)
      players.value.push(playerData)
    })
    teamTwo.forEach((playerData) => {
      getPlayerElo(playerData.id, 2)
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
  if (enablePlayerElo.value === false)
    return

  // Limit starting list of elements.
  const elements = document.querySelector('#parasite-container').shadowRoot.querySelector('#MATCHROOM-OVERVIEW').children
  const rosterOne = elements[2].children.roster1.querySelectorAll('.sc-eHOjnG.sc-iuvYwO.gSaBIZ.dVKwKN')
  const rosterTwo = elements[2].children.roster2.querySelectorAll('.sc-eHOjnG.sc-iuvYwO.gSaBIZ.dVKwKN')
  const prePickRoster = elements[2].children.info.querySelectorAll('.sc-fvShXH')
  const playerNameDivs = [...rosterOne, ...rosterTwo, ...prePickRoster]
  for (let i = 0; i < playerNameDivs.length; i++) {
    players.value.forEach((playerData) => {
      if (!playerNameDivs[i].innerText.includes('(') && !playerNameDivs[i].innerText.includes(')'))
        playerNameDivs[i].innerText = playerNameDivs[i].innerText.replace(`${playerData.nickname}`, `${playerData.nickname} (${playerData.elo})`)
    })
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
  </div>
</template>

<style>
.gain {
  color: green;
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
  height: 40px;
  width: 40px;
  fill: white;
}
.mps_pop_over_window {
  color: #26A69A;
  background-color: #C10015;
}
</style>
