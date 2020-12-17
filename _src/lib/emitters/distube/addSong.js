import Listener from '../../structures/Listener'

export default class AddSong extends Listener {
	constructor(client) {
		super(client);
		/* Emit */
		client.distube.on('addSong', async (message, queue, song) => await this.run({
			Bot: message.client,
			msg: message,
			queue, song
		}));
	}

	async run({ Bot, msg, queue, song }) {
		try {
			/* Message */
			const m = await msg.channel.send(super.createEmbed({
				title: 'Added to Queue',
				color: 'GREEN',
				text: `Added [**__${song.name}__**](${song.url}) to the queue.`,
				fields: {
					'Duration': {
						content: `\`${song.formattedDuration}\``,
						inline: true 
					},
					'# of Plays': { 
						content: song.views.toLocaleString(),
						inline: true
					},
					'Requested by': {
						content: song.user.tag,
						inline: true 
					},
				},
				footer: {
					text: `Thanks for using ${Bot.user.username}!`,
					icon: Bot.user.avatarURL()
				}
			}));
			
			/* Player Controls */
			await this.client.utils.handleControls({ song, msg, embed: m });
		} catch(error) {
			super.log('AddSong@sendMessage', error);
		}
	}
}