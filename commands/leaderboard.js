import {
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
  ComponentType,
} from "discord.js";

const PAGE_SIZE = 10;

/**
 * Makes an leaderboard embed.
 * @param {Array} leaderboard
 * @param {number} page
 */
function make_leaderboard_embed(leaderboard, page = 1) {
  const embed = new EmbedBuilder()
    .setTitle("Sex Leaderboard")
    .setColor("Random")
    .setFooter({
      text: `Page (${page}/${Math.ceil(leaderboard.length / PAGE_SIZE)})`,
    });

  embed.addFields(
    leaderboard
      .slice(PAGE_SIZE * (page - 1), PAGE_SIZE * page)
      .map((rank, i) => ({
        name: `#${i + 1 + PAGE_SIZE * (page - 1)}: ${rank.tag}`,
        value: rank.count.toString(),
        inline: true,
      }))
  );

  return embed;
}

export default {
  name: ["lb", "leaderboard"],
  command: async (db, msg, args) => {
    // define buttons
    const prev_page_btn = new ButtonBuilder()
      .setCustomId("previous")
      .setLabel("<")
      .setStyle(ButtonStyle.Secondary);

    // prettier-ignore
    const next_page_btn = new ButtonBuilder()
    .setCustomId("next")
    .setLabel(">")
    .setStyle(ButtonStyle.Secondary);

    const btn_row = new ActionRowBuilder().addComponents(
      prev_page_btn,
      next_page_btn
    );

    // values of database sorted in descending order based on count
    const leaderboard = Object.values(db.json).sort(
      (a, b) => b.count - a.count
    );
    const page_max = Math.ceil(leaderboard.length / PAGE_SIZE);

    const response = await msg.channel.send({
      embeds: [make_leaderboard_embed(leaderboard)],
      components: [btn_row],
    });

    // setup button interaction callbacks
    const collector = response.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 1000 * 60 * 2,
    });
    let page = 1;

    collector.on("collect", async (interaction) => {
      if (interaction.customId == "previous") {
        if (page <= 1) return;
        page--;
      } else {
        if (page >= page_max) return;
        page++;
      }

      await interaction.update({
        embeds: [make_leaderboard_embed(leaderboard, page)],
        components: [btn_row],
      });
    });
  },
};
