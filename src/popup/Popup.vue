<script setup lang="ts">
import { enablePlayerElo } from '~/logic/storage'
// Defined in vite.config.js
const version = APP_VERSION

const withL = 'Made with <3 by Dandrews'
</script>

<template>
  <div class="popup-settings">
    <q-card dark bordered class="bg-grey-9 my-card">
      <div class="card-one">
        <div class="text-h6">
          Faceit Elo Calculator
        </div>
        <div class="text-subtitle2">
          The easiest way to see estimated elo change before the match.
        </div>
      </div>

      <div class="card-one">
        Display players current elo (Experimental)
        <label class="switch">
          <input
            v-model="enablePlayerElo"
            type="checkbox"
          >
          <span class="slider round" />
        </label>
      </div>

      <hr class="separator" aria-orientation="horizontal">

      <div class="card-one">
        <p>Entire extension is free and opensource, check it out on <a class="github-link" href="https://github.com/DandrewsDev/faceit-elo-calc">Github.</a></p>
        <p>For support: Join the <a class="github-link" href="https://discord.gg/jwhbZC2h9W">(discord)</a> or feel free to send me an <a class="github-link" href="mailto:elo@dandrews.net">Email</a></p>
        <br>
        <p class="last-message">
          {{ withL }}
          (v{{ version }})
        </p>
      </div>
    </q-card>
  </div>
</template>

<style>
.popup-settings {
  width: 20em;
  background-color: #424242;
  color:white;
}
.github-link {
  color:lightcoral;
  font-weight: bold;
}
.last-message {
  margin-bottom: -.5em;
}

.separator {
  border: 0;
  display: block;
  margin-left: 16px;
  margin-right: 16px;
  height: 1px;
  transition: background .3s,opacity .3s;
  flex-shrink: 0;
  background: rgba(255,255,255,.28);
}
hr {
  box-sizing: content-box;
  height: 0;
  overflow: visible;
}
.text-h6 {
  font-size: 1.25rem;
  font-weight: 500;
  line-height: 2rem;
  letter-spacing: .0125em;
}
.text-subtitle2 {
  font-size: .875rem;
  font-weight: 500;
  line-height: 1.375rem;
  letter-spacing: .00714em;
}

.card-one {
  padding: 16px;
  position: relative;
}

.switch {
  position: relative;
  display: inline-block;
  width: 30px;
  height: 16px;
}

/* Hide default HTML checkbox */
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

/* The slider */
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: .4s;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 14px;
  width: 14px;
  left: 0;
  bottom: 1px;
  background-color: white;
  -webkit-transition: .4s;
  transition: .4s;
}

input:checked + .slider {
  background-color: lightcoral;
}

input:focus + .slider {
  box-shadow: 0 0 1px lightcoral;
}

input:checked + .slider:before {
  -webkit-transform: translateX(15px);
  -ms-transform: translateX(15px);
  transform: translateX(15px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}
</style>
