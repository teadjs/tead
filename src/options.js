module.exports = () =>
  process.argv
    .filter(opt => opt.startsWith("--"))
    .map(opt => opt.substring(2).split("="))
    .reduce(
      (otherOpts, [key, value]) =>
        Object.assign(otherOpts, { [key]: !value ? true : value }),
      {}
    );
