import 'dotenv/config';

import { Client, Events, GatewayIntentBits } from 'discord.js';
import { readdirSync } from 'node:fs';

import { Database } from './database.js';
import keepalive from './keepalive.js';
import { getUserSexCount } from './commands/utils.js';

const PREFIX = 's.';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
  ],
});
const db = new Database('database.json');

// write to file before exiting
for (const signal of ['SIGINT', 'SIGUSR1', 'SIGUSR2']) {
  process.on(signal, () => {
    console.log('writing to db..');
    db.write();
    process.exit();
  });
}

// load commands
let commands = {};

for (const file of readdirSync('./commands/')) {
  if (file == 'utils.js') continue;

  const command = (await import(`./commands/${file}`)).default;

  if (Array.isArray(command.name)) {
    for (const name of command.name) {
      commands[name] = command.command;
    }
  } else {
    commands[command.name] = command.command;
  }
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

    await db.set(msg.author.id, {
      tag: msg.author.tag,
      count:
        getUserSexCount(db, msg.author.id) + msg.content.match(/sex/g).length,
    });
  }

  if (msg.content.startsWith(PREFIX)) {
    const args = msg.content.substring(2).split(' ');

    if (args[0] in commands) {
      commands[args[0]](db, msg, args);
    }
  }
});

keepalive(client);
