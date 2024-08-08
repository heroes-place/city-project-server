import { Server } from 'socket.io'
import { createAdapter } from '@socket.io/redis-streams-adapter'

import { getAdapterClient } from '../database/redis/index.js'
import { events } from './events.js'
import auth from '../auth.js'

import { resolveCharacter } from './features/character.js'

class SocketSession {
  constructor(manager, io, socket) {
    this.manager = manager
    this.io = io
    this.socket = socket
  }

  async getCharacter() {
    const characterId = this.manager.getCharacterIdBySession(this.socket.id)

    return await resolveCharacter(characterId)
  }
}

class SocketManager {
  constructor() {
    this.sessions = {}
    this.io = null
  }

  getSessions = () => this.sessions
  getSessionByCharacterId = (characterId) => this.sessions[characterId]
  getCharacterIdBySession = (sessionId) => Object.keys(this.sessions).find(key => this.sessions[key] === sessionId)
  getOthersSessions = (socket) => Object.keys(this.sessions).filter(key => key !== socket.characterId.toString())

  destroyPreviousSession(socket) {
    this.io.sockets.sockets.forEach((s) => {
      if (this.sessions[socket.characterId] === s.id) {
        console.log('[socket] Déconnexion de la session précédente.')
        s.disconnect()
      }
    })

    console.log('[socket] Sessions : ', this.sessions)
  }

  async authSocketMiddleware(socket, next) {
    const header = socket.handshake.headers.authorization

    if (!header) return next(new Error('no token'))

    if (!header.startsWith('Bearer ')) return next(new Error('invalid token'))

    const token = header.substring(7)

    try {
      const decoded = await auth.verifyTokenAuthenticity(token)

      this.sessions[decoded.characterId] = socket.id

      next()
    } catch (err) {
      return next(err)
    }
  }

  listen(server, allowedOrigin, callback) {
    const client = getAdapterClient()

    this.io = new Server(server, {
      adapter: createAdapter(client),
      cors: {
        origin: allowedOrigin,
        methods: ['GET', 'POST'],
        credentials: true
      }
    })

    this.io.disconnectSockets()

    callback()

    this.io.use((socket, next) => this.authSocketMiddleware(socket, next))

    this.io.on('connection', (socket) => {
      console.log('[socket] Nouvelle connexion établie.')

      this.destroyPreviousSession(socket)

      socket.onAny((eventName, ...args) => {
        console.log(`[socket] Event ${eventName} reçu avec les arguments ${args}`)
      })

      for (const [event, handler] of Object.entries(events)) {
        socket.on(event, (content) => {
          try {
            handler({
              socketSession: new SocketSession(this, this.io, socket),
              content: content
            })
          } catch (e) {
            console.log(e)
          }
        })
      }

      socket.conn.on("close", (reason) => {
        // Character dispawn
      })
    })
  }
}

const socketManager = new SocketManager()

export default socketManager
export const {
  io,
  getSessions,
  getOthersSessions
} = socketManager
