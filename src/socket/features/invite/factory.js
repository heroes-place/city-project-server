import { InviteError } from './errors.js'
import { InviteChart } from './chart.js'
import { resolveCharacter } from '../character.js'

class InviteFactory {
  static async createInvite(socketSession, mode, receiver) {
    const senderId = await socketSession.getCharacter()

    console.log('s', senderId)
    const receiverId = await resolveCharacter(receiver)

    switch (mode) {
      case 'chart':
        return new InviteChart(socketSession, senderId, receiverId)
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

export { InviteFactory }