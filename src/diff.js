const arrayIndex = index => `[${index}]`;

const diffArrays = (before, after, context = []) => [
  ...before
    .slice(0, Math.min(before.length, after.length))
    .reduce(
      (diffs, nextBefore, i) =>
        diffs.concat(diff(nextBefore, after[i], context.concat(arrayIndex(i)))),
      []
    ),
  ...before.slice(after.length).map((removed, i) => ({
    removed,
    context: context.concat(arrayIndex(after.length + i))
  })),
  ...after.slice(before.length).map((added, i) => ({
    added,
    context: context.concat(arrayIndex(before.length + i))
  }))
];

const diffObjects = (before, after, context = []) => {
  const beforeProps = Object.keys(before);
  const afterProps = Object.keys(after);
  return [
    ...beforeProps
      .slice(0, Math.min(beforeProps.length, afterProps.length))
      .reduce(
        (diffs, prop) =>
          diffs.concat(
            diff(before[prop], after[prop], context.concat(`.${prop}`))
          ),
        []
      ),
    ...beforeProps.slice(afterProps.length).map((prop, i) => ({
      removed: before[prop],
      context: context.concat(`.${prop}`)
    })),
    ...afterProps.slice(beforeProps.length).map((prop, i) => ({
      added: after[prop],
      context: context.concat(`.${prop}`)
    }))
  ];
};

const diff = (before, after, context = []) => {
  if (after === before) {
    return [];
  }
  if (Array.isArray(before) && Array.isArray(after)) {
    return diffArrays(before, after, context);
  }
  if (typeof before === "object" && typeof after === "object") {
    return diffObjects(before, after, context);
  }
  return [{ before, after, context }];
};

module.exports = diff;
