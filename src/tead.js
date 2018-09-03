#!/usr/bin/env node

const options = require("./options")();
require = require("../esm/esm")(module);

require("./")(options);
