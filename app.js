import 'dotenv/config';

import {
  Client,
  Events,
  GatewayIntentBits,
  EmbedBuilder,
  AttachmentBuilder,
} from 'discord.js';
import { Level } from 'level';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
  ],
});
const db = new Level('database/', { valueEncoding: 'json' });

async function getUserSexCount(id) {
  let count;

  try {
    count = await db.get(id);
  } catch (e) {
    count = 0;
  }

  return count;
}

client.once(Events.ClientReady, c => {
  console.log(`bros ${c.user.tag}`);
});

// client.on(Events.GuildCreate, guild => {

// })

client.on(Events.MessageCreate, async msg => {
  if (msg.content.includes('sex')) {
    console.log(`sex erected by ${msg.author.tag}`);

    await db.put(
      msg.author.id,
      (await getUserSexCount(msg.author.id)) + msg.content.match(/sex/g).length
    );
  } else if (/^s\.i(nfo)?(?=\s|$)/.test(msg.content)) {
    const args = msg.content.split(' ');

    // prettier-ignore
    const id =
      args.length >= 2
        ? ( // checks for mention
            msg.mentions.users.size > 0
              ? msg.mentions.users.first().id
              : args[1]
          )
        : msg.author.id;

    let guildUser;

    try {
      guildUser = await msg.guild.members.fetch(id);
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
        name: guildUser.user.tag,
        iconURL: guildUser.user.avatarURL(),
      })
      .setTitle('Sex Count')
      .setDescription((await getUserSexCount(id)).toString())
      .setColor('Random');

    msg.channel.send({ embeds: [embed] });
  }
});

client.login(process.env.TOKEN);
