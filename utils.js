/**
 * Gets discord tag from user.
 * @param {import("discord.js").User} user
 * @returns {string} user tag
 */
export function getTag(user) {
  return user.discriminator === "0"
    ? user.tag.substring(0, user.tag.length - 2)
    : user.tag;
}

/**
 * Gets a user from a message. Returns author if no user provided and undefined if user is not found.
 * @param {import("discord.js").Message} msg
 * @param {Array} args
 * @param {boolean} [id=false]
 * @returns {import("discord.js").User|undefined}
 */
export async function getUserFromMessage(msg, args, id = false) {
  let user;

  if (args.length == 0) {
    user = msg.author;
  } else if (msg.mentions.users.size > 0) {
    user = msg.mentions.users.first();
  } else {
    try {
      // try to find user in message guild
      user = (await msg.guild.members.fetch(args[0])).user;
    } catch (e) {
      return;
    }
  }

  return id ? user.id : user;
}
