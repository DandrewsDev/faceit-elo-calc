// Currently unused, will be used for any future storage of extension settings.
import { useStorageLocal } from '~/composables/useStorageLocal'

export const enablePlayerElo = useStorageLocal('fec-enable-player-elo-exp', false, { listenToStorageChanges: true })
export const enablePlayerLeetify = useStorageLocal('fec-enable-player-leetify', false, { listenToStorageChanges: true })
