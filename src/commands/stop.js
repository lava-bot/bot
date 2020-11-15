import Command from '../classes/Command.js'
import { logError } from '../utils/logger.js'

export default new Command({
	name: 'stop',
	aliases: ['shutup'],
	description: 'skip the current track',
	usage: 'command',
	cooldown: 3e3,
	music: true
}, async (bot, message, args) => {
	
	/** Check Playing State */
	const isPlaying = bot.player.isPlaying(message);
	if (!isPlaying) {
		return 'There\'s nothing playing in the queue.'
	}

	/** Do the thing */
	try {
		await bot.player.stop(message)
	} catch(error) {
		logError('Command', 'Unable to stop the queue', error)
	}
})