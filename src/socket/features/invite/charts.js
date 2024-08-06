import db from '../../../database/postgresql/index.js'
import { pullMailBox } from '../mailbox.js'
import { getSessions } from '../../index.js'
import { getCharacterIdByName } from '../character.js'

import { InviteError } from '../../errors.js'

const onAddCharacter = async ({ io, socket, content }) => {
  try {
    const receiverId = await getCharacterIdByName(content.characterName)

    const senderId = socket.characterId

    await addCharacter(io, socket, senderId, receiverId)
  } catch (error) {
    console.log(error)
  }
}

const addCharacter = async (io, socket, senderId, receiverId) => {
  if (senderId === receiverId) throw new InviteError('SELF_INVITE')

  const r2 = await db.query('SELECT * FROM invites WHERE sender_id = $1 AND receiver_id = $2', [senderId, receiverId])

  if (r2.rows.length !== 0) throw new InviteError('ALREADY_INVITED')

  await db.query('INSERT INTO invites (sender_id, receiver_id) VALUES ($1, $2)', [senderId, receiverId])

  await pullCharacters(socket, senderId)
  console.log("a", getSessions()[receiverId])
  await pullMailBox(io.sockets.sockets.get(getSessions()[receiverId]), receiverId)

  console.log(`[socket] Invitation de ${senderId} à ${receiverId}`)
}

const onRemoveCharacter = ({ io, socket, content }) => {
  removeCharacter(io, socket, socket.characterId, content)
}

const removeCharacter = async (io, socket, sender, receiver) => {
  // Implémenter la suppression du personnage ici
}

const onCancel = ({ io, socket }) => {
  cancel(io, socket, socket.characterId)
}

const cancel = async (io, socket, sender) => {
  console.log("[socket] Suppression de l'invitation de " + sender)

  const invites = await db.query('DELETE FROM invites WHERE sender_id = $1 RETURNING receiver_id', [sender])

  invites.rows.forEach(i => pullMailBox(io, i.receiverId))
}

const onReply = ({ io, socket, content }) => {
  reply(io, socket, content.sender, socket.characterId, content.answer)
}

const reply = async (io, socket, sender, receiver, answer) => {
  console.log(`[socket] Réponse à l'invitation de ${sender} à ${receiver} : ${answer}`)

  await db.query('UPDATE invites SET status = $1 WHERE sender_id = $2 AND receiver_id = $3', [answer ? 1 : 2, sender, receiver])

  await pullMailBox(io, socket.characterId)

  pullCharacters(io.sockets.sockets.get(getSessions()[sender]), sender)
}

const onPullCharacters = ({ socket }) => {
  pullCharacters(socket, socket.characterId)
}

const pullCharacters = async (socket, sender) => {
  try {
    const r = await db.query('SELECT characters.name name, status FROM invites JOIN characters ON receiver_id = characters.id WHERE sender_id = $1', [sender])
    socket.emit('invite_pull_characters', { characters: r.rows })
  } catch (error) {
    console.log(error.message)
  }
}

export default {
  onAddCharacter,
  addCharacter,
  onRemoveCharacter,
  removeCharacter,
  onReply,
  reply,
  onCancel,
  cancel,
  onPullCharacters,
  pullCharacters
}
