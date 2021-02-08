import { Command } from 'discord-akairo'
import {
	Message, MessageEmbed
} from 'discord.js'

async function deleteMessage(m: Message): Promise<Message> { return m.delete({ timeout: 3000 }) };

export default class Spawn extends Command {
	public client: Akairo.Client;
	public constructor() {
		super('paid', {
			aliases: ['paid'],
			description: 'Updates someone elses or your lava unpaid amounts',
			category: 'Spawn',
			userPermissions: ['MANAGE_MESSAGES'],
			args: [{
				id: 'amount', 
				type: 'number', 
				unordered: true
			}, {
				id: 'user', 
				type: 'member', 
				unordered: true,
				default: (message: Message) => message.member
			}]
		});
	}

	public async exec(_: Message, args: any): Promise<Message> {
		const { amount, user } = args;
		// Args
		if (!amount) return _.reply('You need an amount.').then(deleteMessage);
		else if (!user) return _.reply('You need a user.').then(deleteMessage);
		// Update
		const data = await this.client.db.spawns.removeUnpaid(user.user.id, amount);
		// Message
		const embed = new MessageEmbed({
			author: {
				name: `Updated — ${user.user.tag}`,
				iconURL: user.user.avatarURL({ dynamic: true })
			},
			color: 'ORANGE',
			fields: [{ 
				name: 'Total Unpaid Left', 
				value: data.unpaid.toLocaleString() 
			}],
			timestamp: Date.now(),
			footer: {
				text: this.client.user.username,
				iconURL: this.client.user.avatarURL()
			}
		});

		return _.channel.send(embed);
	}
}