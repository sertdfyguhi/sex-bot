export function getUserSexCount(db, id) {
  return db.get(id)?.count || 0;
}

export function getTag(user) {
  return user.discriminator === '0'
    ? user.tag.substring(0, user.tag.length - 2)
    : user.tag;
}
