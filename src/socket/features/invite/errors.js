import { DisplayableError } from '../../errors.js'

class InviteError extends DisplayableError {
  static types = [
    'SELF_INVITE',
    'ALREADY_INVITED',
    'CHARACTER_NOT_FOUND',
    'INVALID_MODE'
  ]
}

export {
  InviteError
}