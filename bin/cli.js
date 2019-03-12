#!/usr/bin/env node

const yargs = require('yargs');

yargs
  .command('get <source> [proxy]', 'make a get HTTP request', yargs => {
    yargs
      .positional('source', {
        describe: 'URL to fetch content from',
        type: 'string',
        default: 'http://www.google.com'
      })
      .positional('proxy', {
        describe: 'optional proxy URL'
      });
  })
  .command(require('../lib/tool'))
  .demandCommand()
  .help().argv;

// yargs.command(require('./tool')).help().argv;
