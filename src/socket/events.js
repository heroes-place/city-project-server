import { onPullMailbox } from './features/mailbox.js'
import { onCreateVillage } from './features/village.js'
import { onIsVillager, onCharacterSpawn, onCharacterMove } from './features/character.js'

import { onInviteCharacter } from './features/invite/index.js'

const events = {
  invite_character: onInviteCharacter,
  /*uninvite_character: charts.onRemoveCharacter,

  invite_reply: charts.onReply,

  invite_pull_characters: charts.onPullCharacters,
  pull_character_mailbox: onPullMailbox,

  village_create: onCreateVillage,

  character_is_villager: onIsVillager,
  character_spawn: onCharacterSpawn,
  character_move: onCharacterMove*/
}

export { events }
