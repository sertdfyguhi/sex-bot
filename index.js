import "dotenv/config";

import { Client, EmbedBuilder, Events, GatewayIntentBits } from "discord.js";
import { readdirSync } from "node:fs";

import { Database } from "./database.js";
import keepalive from "./keepalive.js";
import * as utils from "./utils.js";

const PREFIX = "s.";
const ENCOURAGEMENT_MSGS = [
  "bro is POUNCING up the leaderboards 🔥🔥🔥",
  "top 1 in NO time 🗣️🗣️🗣️🆙🆙🔥🔥🔥",
  "bro is on FIRE 🔥🔥🔥🔥",
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
const db = new Database("database.json");

// write to file before exiting
// for (const signal of ['SIGINT', 'SIGUSR1', 'SIGUSR2']) {
//   process.on(signal, () => {
//     console.log('writing to db..');
//     db.write();
//     process.exit();
//   });
// }

// load commands
const commands = await Promise.all(
  readdirSync("./commands/").map(
    async (file) => (await import(`./commands/${file}`)).default
  )
);

/**
 * Gets a command.
 * @param {string} name
 * @returns {Object|null}
 */
function getCommand(name) {
  for (const command of commands) {
    if (typeof command.name == "string") {
      if (command.name == name) {
        return command;
      }
    } else {
      if (command.name.includes(name)) {
        return command;
      }
    }
  }

  return null;
}

client.once(Events.ClientReady, () => {
  console.log(`bros ${client.user.tag}`);

  client.user.setPresence({
    activities: [
      {
        name: "run s.sex {mention or id} for sex",
      },
    ],
    status: "online",
  });
});

client.on(Events.MessageCreate, async (msg) => {
  if (msg.content.includes("sex")) {
    const sexCount = msg.content.match(/sex/g).length;

    if (sexCount > 400 && Math.random() < ENCOURAGEMENT_MSG_CHANCE) {
      const index = Math.round(Math.random() * (ENCOURAGEMENT_MSGS.length - 1));
      msg.reply(ENCOURAGEMENT_MSGS[index]);
    }

    console.log(`${sexCount} sexes erected by ${msg.author.tag}`);

    db.set(msg.author.id, {
      tag: utils.getTag(msg.author),
      count: utils.getUserSexCount(db, msg.author.id) + sexCount,
    });

    // write to db (repl is garbage)
    db.write();
  }

  if (msg.content.startsWith(PREFIX)) {
    const args = msg.content.substring(2).split(" ");

    if (args[0] == "help") {
      const embed = new EmbedBuilder()
        .setAuthor({
          name: "Help",
          iconURL: msg.author.avatarURL(),
        })
        .setTitle("Commands")
        .addFields(
          commands.map((command) => ({
            name:
              // command could have multiple names
              typeof command.name == "string"
                ? `${PREFIX}${command.name}`
                : command.name.map((cmd) => `${PREFIX}${cmd}`).join(", "),
            value: command.description,
            inline: true,
          }))
        );

      await msg.channel.send({ embeds: [embed] });
    } else {
      const command = getCommand(args[0]);
      if (command) command.command(db, msg, args);
    }
  }
});

client.on(Events.MessageDelete, async (msg) => {
  if (msg.content.includes("sex")) {
    const sexCount = msg.content.match(/sex/g).length;

    console.log(`${sexCount} sexes flaccided by ${msg.author.tag}`);

    db.set(msg.author.id, {
      tag: msg.author.tag,
      count: utils.getUserSexCount(db, msg.author.id) - sexCount,
    });

    // write to db (repl is garbage)
    db.write();
  }
});

keepalive(client);
