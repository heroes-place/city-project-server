import { pullMailBox } from '../mailbox.js'
import { getSessions } from '../../index.js'
import { resolveCharacter } from '../character.js'

import { Invite } from './default.js'

class InviteChart extends Invite {
  constructor(io, socket, senderId, receiverId) {
    super(senderId, receiverId)
    this.mode = 'chart'

    this.io = io
    this.socket = socket
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
