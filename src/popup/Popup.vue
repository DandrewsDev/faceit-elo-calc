<script setup lang="ts">
import { Dark } from 'quasar'
Dark.set(true)

const withL = 'Made with <3 by Dandrews'
</script>

<template>
  <div class="popup-settings">
    <q-card dark bordered class="bg-grey-9 my-card">
      <q-card-section>
        <div class="text-h6">
          Faceit Elo Calculator
        </div>
        <div class="text-subtitle2">
          The easiest way to see estimated elo change before the match.
        </div>
      </q-card-section>

      <q-separator dark inset />

      <q-card-section>
        <p>Entire extension is free and opensource, check it out on <a class="github-link" href="https://github.com/DandrewsDev/faceit-elo-calc">Github.</a></p>
        <p>For support: Join the <a class="github-link" href="https://discord.gg/jwhbZC2h9W">(discord)</a> or feel free to send me an <a class="github-link" href="mailto:elo@dandrews.net">Email</a></p>
        <br>
        <p class="last-message">
          {{ withL }}
        </p>
      </q-card-section>
    </q-card>
  </div>
</template>

<style>
.popup-settings {
  width: 20em;
}
.github-link {
  color:lightcoral;
  font-weight: bold;
}
.last-message {
  margin-bottom: -.5em;
}
</style>
