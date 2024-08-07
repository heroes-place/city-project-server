import { InviteError } from './errors.js'
import { InviteChart } from './chart.js'

const onInviteCharacter = async ({ io, socket, content }) => {
  const senderId = socket.characterId
  let receiverId

  if (content.characterName) receiverId = await getCharacterIdByName(content.characterName)

  let invite

  switch (content.mode) {
    case 'chart':
      invite = new InviteChart(io, socket, senderId, receiverId)
      break
    case 'message':
      // TODO: Implement message invite
        break
    case 'village':
      // TODO: Implement village invite
          break
    default:
      throw new InviteError('INVALID_MODE')
  }

  await invite.sendInvite()
}

export { onInviteCharacter }