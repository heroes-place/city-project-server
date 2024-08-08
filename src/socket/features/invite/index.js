import { InviteError } from './errors.js'
import { InviteChart } from './chart.js'

import { resolveCharacter } from '../character.js'

class InviteFactory {
  static async createInvite(io, socket, mode, receiver) {
    const senderId = socket.characterId
    let receiverId = await resolveCharacter(receiver)

    console.log('receiverId', receiverId)

    switch (mode) {
      case 'chart':
        return new InviteChart(io, socket, senderId, receiverId)
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
  }
}

const onInviteCharacter = async ({ io, socket, content }) => {
  try {
    const invite = await InviteFactory.createInvite(io, socket, content.mode, content.receiver)
    await invite.sendInvite()
  } catch (e) {
    console.log(e)
  }
}

export { onInviteCharacter }