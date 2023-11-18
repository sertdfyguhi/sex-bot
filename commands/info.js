import { EmbedBuilder, AttachmentBuilder } from "discord.js";
import * as utils from "../utils.js";

export default {
  name: ["i", "info", "sex"],
  description: "gets the sex count of the provided user",

  /**
   * Command callback.
   * @param {import("../database.js").Database} db
   * @param {import("discord.js").Message} msg
   * @param {Array} args
   */
  command: async (db, msg, args) => {
    const user = await utils.getUserFromMessage(msg, args);
    if (!user)
      return msg.channel.send({
        content: `Error: Sex (${args[0]}) not found.`,
        files: [
          new AttachmentBuilder(
            "https://media.tenor.com/1J7bXELQMP4AAAAd/kitten.gif"
          ),
        ],
      });

    const embed = new EmbedBuilder()
      .setAuthor({
        name: utils.getTag(user),
        iconURL: user.avatarURL(),
      })
      .setTitle("Sex Count")
      .setDescription(db.getUserCount(msg.guildId, user.id).toString())
      .setColor("Random");

    msg.channel.send({ embeds: [embed] });
  },
};
