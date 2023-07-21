export default {
  name: 'reset',
  command: async (db, msg, args) => {
    if (msg.author.id === '960911499621179402') {
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
    }
  },
};
