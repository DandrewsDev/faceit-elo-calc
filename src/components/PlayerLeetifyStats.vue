<script setup>
import { ref } from 'vue'
import LeetifyStatsGauge from '~/components/LeetifyStatsGauge.vue'

const props = defineProps({
  playerData: Object,
})

const playerStats = ref({})
const showStats = ref(false)

async function getPlayerStats(playerGameId) {
  showStats.value = false
  try {
    let json = await fetch(`https://api.leetify.com/api/mini-profiles/${playerGameId}`, {
      method: 'GET',
    })

    json = await json.json()
    const leetStatsPlayer = json
    const baseRating = leetStatsPlayer.ratings.leetify * 100
    let leetifyRatingColor = 'white'
    if (baseRating <= -8.1)
      leetifyRatingColor = 'red'
    else if (baseRating <= -3.31)
      leetifyRatingColor = 'orange'
    else if (baseRating <= 3.31)
      leetifyRatingColor = 'white'
    else if (baseRating <= 8.10)
      leetifyRatingColor = 'lightgreen'
    else if (baseRating > 8.10)
      leetifyRatingColor = 'green'

    playerStats.value.leetify_rating = (((baseRating - -8.5) * 100) / (8.5 - -8.5)).toFixed(2)
    playerStats.value.leetify_rating_color = leetifyRatingColor
    playerStats.value.aim_rating = leetStatsPlayer.ratings.aim.toFixed(2)
    playerStats.value.clutch_rating = (((leetStatsPlayer.ratings.clutch * 100) / 16) * 100).toFixed(2)
    playerStats.value.utility_rating = leetStatsPlayer.ratings.utility.toFixed(2)
    playerStats.value.positioning_rating = leetStatsPlayer.ratings.positioning.toFixed(2)
    playerStats.value.opening_duels_rating = (((leetStatsPlayer.ratings.opening - -10) * 100) / (10 - -10)).toFixed(2)
    showStats.value = true
  }
  catch (e) {
    // eslint-disable-next-line no-console
    console.log(e)
  }
}
watch(() => props.playerData, newValue => getPlayerStats(newValue.gameId))
onMounted(() => {
  getPlayerStats(props.playerData.gameId)
})
</script>

<template>
  <div v-if="playerData.hasOwnProperty('gameId')" id="fec_player_leet_stats">
    {{ playerStats.nickname }}
    <LeetifyStatsGauge v-if="showStats" :player-stats="playerStats" />
  </div>
</template>

<style scoped>
</style>
