import { ButtonBuilder, ActionRowBuilder, ButtonStyle } from "discord.js";

export default {
  name: "reset",
  description: "resets your sex count",
  command: async (db, msg, args) => {
    // check if bot author sent commadn
    if (msg.author.id === "1161090382227046470") {
      const id =
        args.length >= 2
          ? // checks for mention
            msg.mentions.users.size > 0
            ? msg.mentions.users.first().id
            : args[1]
          : msg.author.id;

      db.delete(id);
      msg.reply(`get resetted <@${id}> 🤣`);
      db.write();
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
          db.delete(msg.author.id);
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
