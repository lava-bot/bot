import { MessagePlus } from '@lib/extensions/message';
import { Item } from '@lib/handlers/item';

export default class PowerUp extends Item {
  constructor() {
    super('dragon', {
      category: 'Power-Up',
      sellable: false,
      buyable: true,
      usable: true,
      emoji: ':dragon:',
      name: "Lava's Dragon",
      cost: 65000,
      info: {
        short: 'Grants you a great luck in rolling a dice whilst gambling!',
        long: 'Gives you +1 to your gambling dice although you\'ll lose it if your dragon goes away from you.',
      },
    });
  }

  async use(msg: MessagePlus) {
    const data = await msg.author.fetchDB();
    const inv = data.items.find(i => i.id === this.id);

    inv.expire = Date.now() + (12 * 60 * 60 * 1e3); // 12 hours
    await data.save();

    return `Your dragon has been activated for **12 hours** so be careful when gambling :smiley:`;
  }
}
