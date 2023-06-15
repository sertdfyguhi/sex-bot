import 'dotenv/config';

import {
  Client,
  Events,
  GatewayIntentBits,
  EmbedBuilder,
  AttachmentBuilder,
} from 'discord.js';
import { Level } from 'level';

import keepalive from './keepalive.js';

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

client.once(Events.ClientReady, () => {
  console.log(`bros ${client.user.tag}`);

  client.user.setPresence({
    activities: [
      {
        name: 'run s.sex {mention or id} for sex',
      },
    ],
    status: 'online',
  });
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
  }

  if (/^s\.(i|info|sex)(?=\s|$)/.test(msg.content)) {
    const args = msg.content.split(' ');

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
        name: user.tag,
        iconURL: user.avatarURL(),
      })
      .setTitle('Sex Count')
      .setDescription((await getUserSexCount(user.id)).toString())
      .setColor('Random');

    msg.channel.send({ embeds: [embed] });
  }
});

keepalive(client);
