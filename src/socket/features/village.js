import db from '../../database/postgresql/index.js'
import { isVillager } from './character.js'
import { CharacterError, VillageError } from '../errors.js'

import { createChannel, deleteChannel, joinChannel } from './chat/channels.js'

const onCreateVillage = async ({ socket, content }) => {
  try {
    await createVillage(content.name, socket.characterId, [])
  } catch (error) {
    console.log(error)
  }
}

const createVillage = async (name, chart) => {
  name = name.toLowerCase()

  // TODO: Verifier les paramètres

  const founderId = chart[0].id

  try {
    await isVillager(founderId).then((result) => {
      if (result) throw new CharacterError('IS_VILLAGE_MEMBER')
    })

    await doesVillageExist(name).then((result) => {
      if (result) throw new VillageError('VILLAGE_NAME_TAKEN')
    })

    // TODO: Transformer en transaction

    const channelId = await createChannel(4) // 4 = Village

    await joinChannel(channelId, founderId)

    const res = await db.query('INSERT INTO villages (name, founder_id, channel_id) VALUES ($1, $2, $3) RETURNING id', [name, founderId, channelId])

    console.log(`[socket] Village ${name} créé par ${founderId}`)

    for (const member of chart) {
      await joinVillage(res.rows[0].id, member.id, member.role)
    }
  } catch (e) {
    console.log(e)
    throw e
  }
}

const joinVillage = async (villageId, characterId, role) => {
  try {
    await isVillager(characterId).then((result) => {
      if (result) throw new CharacterError('IS_VILLAGE_MEMBER')
    })

    await db.query('INSERT INTO villages_members (village_id, character_id) VALUES ($1, $2)', [villageId, characterId])

    console.log(`[socket] Character ${characterId} joined village ${villageId}`)
  } catch (e) {
    console.log(e)
  }
}

const getVillage = async (villageId) => {
  try {
    const res = await db.query('SELECT * FROM villages WHERE id = $1', [villageId])

    return res.rows[0]
  } catch (e) {
    console.log(e)
  }
}

const doesVillageExist = async (name) => {
  try {
    const res = await db.query('SELECT * FROM villages WHERE name = $1', [name])

    return res.rows.length !== 0
  } catch (e) {
    console.log(e)
  }
}

const deleteVillage = async (villageId) => {
  const channelId = await getVillage(villageId).channel_id

  await deleteChannel(channelId)

  await db.query('DELETE FROM villages WHERE id = $1', [villageId])
}

export {
  onCreateVillage,
  createVillage,
  deleteVillage
}
