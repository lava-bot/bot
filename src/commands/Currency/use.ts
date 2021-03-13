import { Message, MessageOptions } from 'discord.js';
import { Command } from '@lib/handlers/command';
import { Embed } from '@lib/utility/embed';
import { Item } from '@lib/handlers/item';

export default class Currency extends Command {
  constructor() {
    super('use', {
      aliases: ['use', 'consume'],
      channel: 'guild',
      description: 'Use an item you own.',
      category: 'Currency',
      cooldown: 1000,
      args: [
        {
          id: 'item',
          type: 'shopItem',
          unordered: true,
        }
      ],
    });
  }

  async exec(
    msg: Message,
    args: {
      item: Item;
    }
  ): Promise<string | MessageOptions> {
    const { item: Items } = this.client.handlers;
    const { fetch } = this.client.db.currency;
    const { item } = args;
		const isPromise = this.client.util.isPromise.bind(this.client.util);
    const data = await fetch(msg.author.id);

    if (!item) return 'This item doesn\'t exist, whatever bro';
    const inv = data.items.find(i => i.id === item.id);
    if (!inv || inv.amount < 1) return 'You don\'t have this item'

		const ret = await item.use(msg);
		return { content: ret, reply: msg.author.id };
  }
}
