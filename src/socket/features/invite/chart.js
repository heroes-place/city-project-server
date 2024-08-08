import { getSessions } from '../../index.js'
import { resolveCharacter } from '../character.js'

import { Invite } from './default.js'

class InviteChart extends Invite {
  constructor(session, senderId, receiverId) {
    super(session, senderId, receiverId, 'chart')
  }

  async sendInvite() {
    super.sendInvite()

    // await pullCharacters(this.socket, this.senderId)
    // await pullMailBox(this.io.sockets.sockets.get(getSessions()[this.receiverId]), this.receiverId)
  }

  async replyInvite(answer) {
    super.replyInvite(answer)

    // await pullMailBox(io, socket.characterId)
    // await pullCharacters(io.sockets.sockets.get(getSessions()[this.senderId]), this.senderId)
  }
}

export { InviteChart }
