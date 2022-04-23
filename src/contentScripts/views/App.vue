<script setup lang="ts">
import { useToggle } from '@vueuse/core'
import { Dark } from 'quasar'
import { ref } from 'Vue'
import imgUrl from '../../assets/icon.svg'
import DisplayElo from '~/contentScripts/views/DisplayElo.vue'

Dark.set(true)
setInterval(() => { insertElement() }, 1500)
const display = ref(false)

function insertElement() {
  const currentURL = window.location.pathname
  display.value = currentURL.includes('/en/csgo/room')
  const parasite_container = document.querySelector('#parasite-container')
  if (!parasite_container || !parasite_container.shadowRoot)
    return

  const match_overview = parasite_container.shadowRoot.querySelector('#MATCHROOM-OVERVIEW')

  const elo_container = document.querySelector('#faceit-elo-calc-container')
  if (elo_container && elo_container.shadowRoot.getElementById('elo-display')) {

    const styleEl = document.createElement('link')
    styleEl.setAttribute('rel', 'stylesheet')
    styleEl.setAttribute('href', browser.runtime.getURL('dist/contentScripts/style.css'))
    parasite_container.shadowRoot.appendChild(styleEl)

    const elo_id = document.querySelector('#faceit-elo-calc-container').shadowRoot.getElementById('elo-display')
    const cloned_div = elo_id.cloneNode(true)
    const element_exists = match_overview.querySelector('#elo-display')
    if (!element_exists) {
      match_overview.prepend(cloned_div)
    }
  }
}

</script>

<template>
  <div v-if="display" id="elo-display">
    <DisplayElo />
  </div>
</template>

<style>
</style>
