import { EmbedBuilder, AttachmentBuilder } from 'discord.js';
import * as utils from './utils.js';

export default {
  name: ['i', 'info', 'sex'],
  command: async (db, msg, args) => {
    // prettier-ignore
    const id =
      args.length >= 2
        ? ( // checks for mention
            msg.mentions.users.size > 0
              ? msg.mentions.users.first()
              : args[1]
          )
        : msg.author.id;

    let user;

    try {
      user =
        typeof id == 'string' ? (await msg.guild.members.fetch(id)).user : id;
    } catch (e) {
      const gif = new AttachmentBuilder(
        'https://media.tenor.com/1J7bXELQMP4AAAAd/kitten.gif'
      );

      msg.channel.send({
        content: `error: sex (${id}) not found.`,
        files: [gif],
      });

      return;
    }

    // console.log(guildUser);

    const embed = new EmbedBuilder()
      .setAuthor({
        name: utils.getTag(user),
        iconURL: user.avatarURL(),
      })
      .setTitle('Sex Count')
      .setDescription(utils.getUserSexCount(db, user.id).toString())
      .setColor('Random');

    msg.channel.send({ embeds: [embed] });
  },
};
