export function getUserSexCount(db, id) {
  return db.get(id).count || 0;
}
