import { Message, MessageOptions, Collection } from 'discord.js';
import { Document } from 'mongoose';
import { Argument } from 'discord-akairo';

import { CurrencyProfile } from '@lib/interface/mongo/currency';
import { InventorySlot } from '@lib/interface/handlers/item';
import { Command } from '@lib/handlers/command';
import { Effects } from '@lib/utility/effects';
import { Embed } from '@lib/utility/embed';
import { Item } from '@lib/handlers/item';

export default class Currency extends Command {
  constructor() {
    super('bet', {
      aliases: ['gamble', 'roll', 'bet'],
      channel: 'guild',
      description: 'Totally not rigged gambling game for grinders.',
      category: 'Currency',
      cooldown: 3000,
      args: [
        {
          id: 'amount',
          type: 'gambleAmount',
        },
      ],
    });
  }

  async before(msg: Message) {
    const data = await this.client.db.currency.updateItems(msg.author.id);
    const items = this.client.handlers.item.modules;
    const itemEf: { [k: string]: [keyof Effects, number] } = {
      'heart': ['setWinnings', 0.5],
      'thicc': ['setWinnings', 0.5]
    }

    for (const item of [...items.values()]) {
      for (const [it, val] of Object.entries(itemEf)) {
        await this.client.util.updateEffects({
          data,
          slot: data.items.find(i => i.id === item.id),
          userID: msg.author.id,
          key: itemEf[it][0],
          val: itemEf[it][1]
        });
      }
    }
  }

  public async exec(
    _: Message,
    args: {
      amount?: number;
    }
  ): Promise<string | MessageOptions> {
    const {
      util,
      util: { effects },
      config: { currency },
      db: { currency: DB },
    } = this.client;

    // Core
    const { maxWin, maxMulti, maxBet } = currency;
    const data = await DB.updateItems(_.author.id);
    let { total: multi } = await DB.utils.calcMulti(this.client, _);
    const { amount: bet } = args;
    if (multi >= maxMulti) multi = maxMulti as number;
    if (!bet) return;

    // Item Effects
    let extraWngs: number = 0;
    const userEf = effects.get(_.author.id);
    if (!userEf.get('thicc')) extraWngs += 0;
    else extraWngs += userEf.get('thicc').winnings;
    if (!userEf.get('heart')) extraWngs += 0;
    else extraWngs += userEf.get('heart').winnings;

    // Dice
    let userD = util.randomNumber(1, 12);
    let botD = util.randomNumber(1, 12);
    if (Math.random() > 0.6) {
      userD = (botD > userD ? [botD, (botD = userD)] : [userD])[0];
    } else {
      botD = (userD > botD ? [userD, (userD = botD)] : [botD])[0];
    }

    // vis and db
    let w: number,
      perwn: number,
      description: string[],
      identifier: string,
      color: string;

    if (botD === userD || botD > userD) {
      const ties = botD === userD;
      let lost = ties ? Math.round(bet / 4) : bet;
      data.pocket -= lost;

      identifier = ties ? 'tie' : 'losing';
      color = ties ? 'YELLOW' : 'RED';
      description = [
        `You lost **${lost.toLocaleString()}**\n`,
        `You now have **${data.pocket.toLocaleString()}**`,
      ];
    } else if (userD > botD) {
      let wngs = Math.random() * 2;
      if (wngs < 0.3) wngs += 0.3;
      wngs += extraWngs;
      w = Math.round(bet * wngs);
      w = w + Math.round(w * (multi / 100));
      if (w > maxWin) w = maxWin as number;
      perwn = Number((w / bet).toFixed(2));
      data.pocket += w;

      identifier = Boolean(extraWngs) ? 'thicc' : 'winning';
      color = Boolean(extraWngs) ? 'BLUE' : 'GREEN';
      description = [
        `You won **${w.toLocaleString()}**\n`,
        `**Multiplier** \`x${perwn.toLocaleString()}\``,
        `You now have **${data.pocket.toLocaleString()}**`,
      ];
    }

    const embed = new Embed()
      .setAuthor(
        `${_.author.username}'s ${identifier} gambling game`,
        _.author.displayAvatarURL({ dynamic: true })
      )
      .setFooter(false, `Multiplier: ${multi}%`, this.client.user.avatarURL())
      .addField(_.author.username, `Rolled a \`${userD}\``, true)
      .addField(this.client.user.username, `Rolled a \`${botD}\``, true)
      .setDescription(description.join('\n'))
      .setColor(color);

    await data.save()
    return { embed };
  }
}
