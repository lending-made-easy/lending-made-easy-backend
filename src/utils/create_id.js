export const create_id = (prefix, randomCount) => {
  const characters =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"; // 62 char long
  let random_id = prefix;
  for (let i = 0; i < randomCount; i++) {
    const idx = Math.floor(62 * Math.random());
    random_id += characters[idx];
  }
  return random_id;
};
