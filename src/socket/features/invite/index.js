import { InviteFactory } from './factory.js'

const onInviteCharacter = async ({ socketSession, content }) => {
  try {
    const invite = await InviteFactory.createInvite(socketSession, content.mode, content.receiver)
    await invite.sendInvite()
  } catch (e) {
    console.log(e)
  }
}

export { onInviteCharacter }