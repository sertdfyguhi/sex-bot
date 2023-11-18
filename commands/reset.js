import { ButtonBuilder, ActionRowBuilder, ButtonStyle } from "discord.js";
import { getUserFromMessage } from "../utils.js";

export default {
  name: "reset",
  description: "resets your sex count",

  /**
   * Command callback.
   * @param {import("../database.js").Database} db
   * @param {import("discord.js").Message} msg
   * @param {Array} args
   */
  command: async (db, msg, args) => {
    // check if bot author sent commadn
    if (msg.author.id === "1161090382227046470") {
      const id = await getUserFromMessage(msg, args, true);

      db.resetSexCount(msg.guildId, id);
      db.write();

      msg.reply(`Resetted <@${id}>'s sex count. 🤣`);
    } else {
      // define buttons
      const no_btn = new ButtonBuilder()
        .setCustomId("no")
        .setLabel("❌")
        .setStyle(ButtonStyle.Danger);

      const yes_btn = new ButtonBuilder()
        .setCustomId("yes")
        .setLabel("✅")
        .setStyle(ButtonStyle.Success);

      const btn_row = new ActionRowBuilder().addComponents(no_btn, yes_btn);
      const response = await msg.reply({
        content: "Are you sure you want to reset your sex count? (❌/✅)",
        components: [btn_row],
      });

      try {
        const confirmation = await response.awaitMessageComponent({
          filter: interaction => interaction.user.id == msg.author.id,
          time: 1000 * 60,
        });

        if (confirmation.customId === "yes") {
          db.resetSexCount(msg.guildId, msg.author.id);
          db.write();

          await confirmation.update({
            content: `Sex count for ${msg.author} resetted.`,
            components: [],
          });
        } else {
          await confirmation.update({
            content: "Reset cancelled.",
            components: [],
          });
        }
      } catch (e) {
        // if confirmation timeout is exceeded
        await confirmation.update({
          content: "Confirmation not received in a minute, reset cancelled.",
          components: [],
        });
      }
    }
  },
};
