export async function resolve(specifier, context, nextResolve) {
  const nextResult = await nextResolve(specifier, context);
  if (nextResult.url.startsWith("file://")) {
    // appending a unique id to imports is the most reliable way
    // to make sure the latest module code is used each time
    const url = new URL(nextResult.url);
    url.searchParams.set("v", Date.now());
    return {
      shortCircuit: true,
      url: url.href
    };
  }
  return nextResult;
}
