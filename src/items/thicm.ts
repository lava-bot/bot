import { MessagePlus } from '@lib/extensions/message';
import { Item } from '@lib/handlers/item';

export default class PowerUp extends Item {
  constructor() {
    super('thicm', {
      category: 'Power-Up',
      sellable: true,
      buyable: true,
      usable: true,
      emoji: ':ok_hand:',
      name: 'Thicco Mode',
      cost: 2750000,
      info: {
        short: 'Blackjack rigged? Well if you want more coins, activate thicco mode.',
        long: 'Gives you +50% winnings on blackjack for 10 minutes.',
      }
    });
  }

  async use(msg: MessagePlus): Promise<string> {
    const data = await msg.author.fetchDB();
    const thicc = data.items.find((i) => i.id === this.id);

    thicc.expire = Date.now() + (10 * 60 * 1000);
    thicc.amount--;

    await msg.author.initDB(data).updateItems().db.save();
    return `**You activated thicco mode**\nYou've been granted a **50%** winnning power for blackjack for 10 minutes!`;
  }
}
