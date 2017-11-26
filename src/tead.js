#!/usr/bin/env node

require = require("@std/esm")(module, {
  esm: "js",
  cjs: true
});
require("./")(require("./options"));
