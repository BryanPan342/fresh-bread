#!/usr/bin/env node
import * as yargs from 'yargs';
import { FreshBreadToolkit } from '../lib';
import { print } from '../lib/private/logging';
import { versionNumber } from '../lib/private/version';
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-shadow */ // yargs

async function parseArguments() {
  // Use the following configuration for array arguments:
  //
  //     { type: 'array', default: [], nargs: 1, requiresArg: true }
  //
  // The default behavior of yargs is to eat all strings following an array argument:
  //
  //   ./prog --arg one two positional  => will parse to { arg: ['one', 'two', 'positional'], _: [] } (so no positional arguments)
  //   ./prog --arg one two -- positional  => does not help, for reasons that I can't understand. Still gets parsed incorrectly.
  //
  // By using the config above, every --arg will only consume one argument, so you can do the following:
  //
  //   ./prog --arg one --arg two position  =>  will parse to  { arg: ['one', 'two'], _: ['positional'] }.

  return yargs
    .usage('Usage: fresh-bread COMMAND')
    .command('hello', 'hello world')
    .version(versionNumber())
    .alias('v', 'version')
    .demandCommand(1, '') // just print help
    .recommendCommands()
    .help()
    .alias('h', 'help')
    .argv;
}

async function main(): Promise<number> {
  const argv = await parseArguments();
  const command = argv._[0];

  const cli = new FreshBreadToolkit();

  switch (command) {
    case 'hello': {
      cli.hello();
      return 0;
    }
    default: {
      throw new Error('Received unknown command: ' + command);
    }
  }
}

main()
  .then(value => {
    process.exitCode = value;
  })
  .catch(err => {
    print(err);
    process.exitCode = 1;
  });