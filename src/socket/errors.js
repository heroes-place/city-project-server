class DisplayableError extends Error {
  static types = []

  constructor (message) {
    super(message)

    if (!this.isTypeCorrect(message)) {
      this.message = 'Unknown error'
    }
  }

  display (socket) {
    console.log('[socket] Error : ', this.message)
    socket.emit('server_alert', { message: this.message })
  }

  isTypeCorrect (type) {
    return this.constructor.types.includes(type)
  }
}

class VillageError extends DisplayableError {
  static types = [
    'VILLAGE_NOT_FOUND',
    'VILLAGE_NAME_TAKEN'
  ]
}

class CharacterError extends DisplayableError {
  static types = [
    'CHARACTER_NOT_FOUND',
    'IS_VILLAGE_MEMBER'
  ]
}

export {
  DisplayableError,
  VillageError,
  CharacterError
}
