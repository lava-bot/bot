import { MessagePlus } from '@lib/extensions/message';
import { MessageEmbed } from 'discord.js';
import { Listener } from '@lib/handlers';
import { Command } from 'discord-akairo';

export default class CommandListener extends Listener {
  constructor() {
    super('missingPermissions', {
      emitter: 'command',
      event: 'missingPermissions',
    });
  }

  async exec(
    msg: MessagePlus,
    command: Command,
    type: string,
    missing: any
  ): Promise<MessagePlus> {
    type = type === 'client' ? 'I' : 'You';
    const d: string[] = [];
    d.push(
      `${type} don\'t have enough permissions to run the \`${command.id}\` command.`
    );
    d.push(`Ensure ${type} have the following permissions:`);

    const embed = new MessageEmbed()
      .setDescription(d.join('\n'))
      .setColor('RED')
      .addField(
        `Missing Permissions • ${missing.length}`,
        `\`${missing.join('`, `')}\``
      )
      .setFooter(this.client.user.username, this.client.user.avatarURL())
      .setTitle('Well rip, no perms.');

    return msg.channel.send({ embed }) as Promise<MessagePlus>;
  }
}
