import 'dotenv/config';

import { Client, Events, GatewayIntentBits } from 'discord.js';
import { readdirSync } from 'node:fs';

import { Database } from './database.js';
import keepalive from './keepalive.js';
import { getUserSexCount } from './commands/utils.js';

const PREFIX = 's.';
const ENCOURAGEMENT_MSGS = [
  'bro is POUNCING up the leaderboards 🔥🔥🔥',
  'top 1 in NO time 🗣️🗣️🗣️🆙🆙🔥🔥🔥',
  'bro is on FIRE 🔥🔥🔥🔥',
];
const ENCOURAGEMENT_MSG_CHANCE = 1 / 5;

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
// for (const signal of ['SIGINT', 'SIGUSR1', 'SIGUSR2']) {
//   process.on(signal, () => {
//     console.log('writing to db..');
//     db.write();
//     process.exit();
//   });
// }

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

client.on(Events.MessageCreate, async msg => {
  if (msg.content.includes('sex')) {
    const sexCount = msg.content.match(/sex/g).length;

    if (sexCount > 400 && Math.random() < ENCOURAGEMENT_MSG_CHANCE) {
      const index = Math.round(Math.random() * ENCOURAGEMENT_MSGS.length);
      msg.reply(ENCOURAGEMENT_MSGS[index]);
    }

    console.log(`${sexCount} sexes erected by ${msg.author.tag}`);

    db.set(msg.author.id, {
      tag: msg.author.tag,
      count: getUserSexCount(db, msg.author.id) + sexCount,
    });

    // write to db (repl is garbage)
    db.write();
  }

  if (msg.content.startsWith(PREFIX)) {
    const args = msg.content.substring(2).split(' ');

    if (args[0] in commands) {
      commands[args[0]](db, msg, args);
    }
  }
});

client.on(Events.MessageDelete, async msg => {
  if (msg.content.includes('sex')) {
    const sexCount = msg.content.match(/sex/g).length;

    console.log(`${sexCount} sexes flaccided by ${msg.author.tag}`);

    db.set(msg.author.id, {
      tag: msg.author.tag,
      count: getUserSexCount(db, msg.author.id) - sexCount,
    });

    // write to db (repl is garbage)
    db.write();
  }
});

keepalive(client);
