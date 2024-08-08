import { InviteFactory } from './factory.js'

const onInviteCharacter = async ({ io, socket, content }) => {
  try {
    const invite = await InviteFactory.createInvite(io, socket, content.mode, content.receiver)
    await invite.sendInvite()
  } catch (e) {
    console.log(e)
  }
}

export { onInviteCharacter }