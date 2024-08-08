import { onCreateVillage } from './features/village.js'
import { onIsVillager, onCharacterSpawn, onCharacterMove } from './features/character.js'

import { onInviteCharacter } from './features/invite/index.js'

const events = {
  invite_character: onInviteCharacter,

  /*uninvite_character: charts.onRemoveCharacter,
  pull_character_mailbox: onPullMailbox,

  invite_reply: charts.onReply,

  invite_pull_characters: charts.onPullCharacters,

  village_create: onCreateVillage,

  character_is_villager: onIsVillager,
  character_spawn: onCharacterSpawn,
  character_move: onCharacterMove*/
}

export { events }
