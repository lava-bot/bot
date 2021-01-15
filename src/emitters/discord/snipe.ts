import { Listener, LavaListener, LavaClient } from 'discord-akairo'
import { Message, PartialMessage } from 'discord.js'

export default class Discord extends Listener implements LavaListener {
	public client: LavaClient;
	public constructor() {
		super('snipe', {
			emitter: 'client',
			event: 'messageDelete'
		});
	}

	public async exec(message: Message | PartialMessage): Promise<any> {
		// TODO
	}
}
