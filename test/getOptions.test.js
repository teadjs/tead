import getOptions from "../src/getOptions.js";

export default {
  getOptions: {
    "is a function": [typeof getOptions, "function"],
    "should process empty args": [getOptions([]), {}],
    "should process invalid args": [getOptions(["invalid"]), {}],
    "should process single arg": [getOptions(["--foo=bar"]), { foo: "bar" }],
    "should process multiple args": [
      getOptions(["--testPattern=.*test\\.js$", "ignored", "--watch"]),
      {
        testPattern: ".*test\\.js$",
        watch: true
      }
    ]
  }
};
