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
 * @param {import("discord.js").Guild} guild
 * @param {number} [page=1]
 * @returns {EmbedBuilder} leaderboard embed
 */
async function make_leaderboard_embed(leaderboard, guild, page = 1) {
  const page_start_index = PAGE_SIZE * (page - 1);
  const embed = new EmbedBuilder()
    .setTitle("Sex Leaderboard")
    .setColor("Random")
    .setFooter({
      text: `Page (${page}/${Math.ceil(leaderboard.length / PAGE_SIZE)})`,
    })
    .addFields(
      leaderboard
        // get next 10 starting from page start index
        .slice(page_start_index, PAGE_SIZE * page)
        .map((rank, i) => ({
          name: `#${page_start_index + i + 1}}: ${rank.tag}`,
          value: rank.count.toString(),
          inline: true,
        }))
    );

  return embed;
}

export default {
  name: ["lb", "leaderboard"],
  description: "shows the top sex counts",

  /**
   * Command callback.
   * @param {import("../database.js").Database} db
   * @param {import("discord.js").Message} msg
   * @param {Array} args
   */
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

    if (!(msg.guildId in db.json))
      return msg.reply("No sex count statistics for this server.");

    // values of database sorted in descending order based on count
    const leaderboard = Object.values(db.json[msg.guildId]).sort(
      (a, b) => b.count - a.count
    );
    const page_max = Math.ceil(leaderboard.length / PAGE_SIZE);

    const response = await msg.channel.send({
      embeds: [await make_leaderboard_embed(leaderboard, msg.guild)],
      components: [btn_row],
    });

    // setup button interaction callbacks
    const collector = response.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 1000 * 60 * 2,
    });
    let page = 1;

    collector.on("collect", async interaction => {
      if (interaction.customId == "previous") {
        if (page <= 1) return;
        page--;
      } else {
        if (page >= page_max) return;
        page++;
      }

      await interaction.update({
        embeds: [await make_leaderboard_embed(leaderboard, msg.guild, page)],
        components: [btn_row],
      });
    });
  },
};
