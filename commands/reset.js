export default {
  name: 'reset',
  command: async (db, msg, args) => {
    db.delete(msg.author.id);
    msg.reply('get resetted 🤣');
    db.write();
  },
};
