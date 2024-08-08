import db from '../../../database/postgresql/index.js'
import { resolveCharacter } from '../character.js'
import { InviteError } from './errors.js'

class Invite {
  constructor(session, senderId, receiverId, mode) {
    this.session = session

    this.senderId = senderId
    this.receiverId = receiverId

    this.mode = mode
  }

  async sendInvite() {
    try {
      if (this.senderId === this.receiverId) throw new InviteError('SELF_INVITE')

      await resolveCharacter(this.receiverId)

      const r1 = await db.query('SELECT * FROM invites WHERE sender_id = $1 AND receiver_id = $2 AND mode = $3', [this.senderId, this.receiverId, this.mode])

      if (r1.rows.length !== 0) throw new InviteError('ALREADY_INVITED')

      await db.query('INSERT INTO invites (sender_id, receiver_id, mode) VALUES ($1, $2, $3)', [this.senderId, this.receiverId, this.mode])

      console.log(`[socket] Invitation de ${this.senderId} à ${this.receiverId}`)
    } catch (e) {
      console.log(e)
    }
  }

  async cancelInvite() {
    // TODO: Verifier si l'invitation existe
    const invites = await db.query('DELETE FROM invites WHERE sender_id = $1 RETURNING receiver_id', [this.senderId])

    invites.rows.forEach(i => pullMailBox(io, i.receiverId))

    console.log("[socket] Suppression de l'invitation de " + this.senderId)
  }

  async replyInvite(answer) {
    await db.query('UPDATE invites SET status = $1 WHERE sender_id = $2 AND receiver_id = $3', [answer ? 1 : 2, this.senderId, this.receiverId])

    console.log(`[socket] Réponse à l'invitation de ${this.senderId} à ${this.receiverId} : ${answer}`)
  }
}

export { Invite }