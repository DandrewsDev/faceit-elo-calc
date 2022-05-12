<script setup lang="ts">
import { Dark } from 'quasar'
import DisplayElo from '~/contentScripts/views/DisplayElo.vue'

Dark.set(true)

</script>

<template>
  <div id="elo-display">
    <DisplayElo />
  </div>
</template>

<style>
</style>
