#!/usr/bin/env node

/**
 * @author Aman Lodha
 * @version 1.2.8
 * @description Starting point of the Website Publisher CLI project.
 * The project's goal is to provide an easy-to-use CLI to deploy frontend applications with minimal hassle.
 * This CLI tool can be used to deploy, undeploy and keep track of the various frontend applications which are deployed.
 * @license MIT
 */

const commander = require("commander");
const program = new commander.Command();

const initializeCLI = require("./utils/createStateFiles");

// Initialise CLI and parse the arguments passed to run the appropriate commands
(async () => {
	await initializeCLI();

	// Authentication related commands
	require("./src/signin")(program);
	require("./src/signup")(program);

	// Deployment related commands
	require("./src/user")(program);
	require("./src/up")(program);
	require("./src/down")(program);
	require("./src/list")(program);
	program.parse(process.argv);
})();
