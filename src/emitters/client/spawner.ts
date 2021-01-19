import { Listener, LavaClient } from 'discord-akairo'
import { Message, MessageEmbed } from 'discord.js'

export default class Discord extends Listener {
	public client: LavaClient;
	public constructor() {
		super('spawner', {
			emitter: 'client',
			event: 'message'
		});
	}

	public async exec(message: Message): Promise<MessageEmbed | any> {
		if (!this.client.config.spawn.enabled) return;
		if (message.author.bot || message.channel.type === 'dm') return;
		const spawner = this.client.util.random('arr', this.client.spawners.array());
		const { queue } = this.client;
		if (queue.has(message.member.user.id)) return;
		const { config } = spawner;

		// Odds
		if (Math.round(Math.random() * 100) >= (100 - config.odds)) {
			const results = await spawner.run(message);
			if (results) await message.channel.send({ embed: results });
			else return;
		}
	}
}