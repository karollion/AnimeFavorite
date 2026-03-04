module.exports = (obj, allowed) =>
  Object.fromEntries(
    Object.entries(obj)
      .filter(([key]) => allowed.includes(key))
  );