#!/usr/bin/env node

const options = require("./options")();
require = require("esm")(module);

require("./")(options);
