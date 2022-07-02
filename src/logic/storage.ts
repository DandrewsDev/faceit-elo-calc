// Currently unused, will be used for any future storage of extension settings.
import { useStorageLocal } from '~/composables/useStorageLocal'

export const enablePlayerElo = useStorageLocal('fec-enable-player-elo', true, { listenToStorageChanges: true })
