import { EmbedBuilder } from "discord.js";

export default {
  name: ["lb", "leaderboard"],
  command: async (db, msg, args) => {
    const embed = new EmbedBuilder()
      .setTitle("Sex Leaderboard")
      .setColor("Random");

    // values of database sorted in descending order based on count
    const leaderboard = Object.values(db.json)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    embed.addFields(
      leaderboard.map((rank, i) => ({
        name: `#${i + 1}: ${rank.tag}`,
        value: rank.count.toString(),
        inline: true,
      }))
    );

    msg.channel.send({ embeds: [embed] });
  },
};
