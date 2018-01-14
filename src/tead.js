#!/usr/bin/env node

const options = require("./options")();

/* istanbul ignore if */
if (!options.noesm) {
  require = require("@std/esm")(module, {
    esm: "js",
    cjs: true
  });
}

require("./")(options);
