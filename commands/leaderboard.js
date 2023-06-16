import { EmbedBuilder } from 'discord.js';

export default {
  name: ['lb', 'leaderboard'],
  command: async (db, msg, args) => {
    let leaderboard = [];

    for (const v of Object.values(db.json).sort((a, b) => b.count - a.count)) {
      if (leaderboard.length == 10) break;
      leaderboard.push(`${leaderboard.length + 1}. ${v.tag}: ${v.count}`);
    }

    const embed = new EmbedBuilder()
      .setTitle('Sex Leaderboard')
      .setDescription(leaderboard.join('\n') || 'none')
      .setColor('Random');

    msg.channel.send({ embeds: [embed] });
  },
};
