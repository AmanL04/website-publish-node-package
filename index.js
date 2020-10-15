#!/usr/bin/env node

const commander = require("commander");
const program = new commander.Command();

require("./src/signin")(program);
require("./src/signup")(program);

require("./src/user")(program);
require("./src/up")(program);
require("./src/down")(program);
require("./src/list")(program);

program.parse(process.argv);
