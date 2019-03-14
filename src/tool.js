// @noflow
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import chalk from 'chalk';
import dedent from 'dedent';
import Project from '@lerna/project'; // eslint-disable-line import/no-extraneous-dependencies
import { box } from 'ascii-box';
import log from 'npmlog';
import Ora from 'ora';
import server from './server';

/**
 * Yargs command used to release scoped packages in the presentation layer.
 */
class ReleaseCommand {
  constructor(YargsConfig) {
    this.lernaProject = new Project();
    this.scope = YargsConfig.builder.scope.default;
    this.scopedDependencies = YargsConfig.builder.scopedDependencies.default;
    this.scopedPackages = [];
    this.open = YargsConfig.builder.open.default;
  }

  /**
   * 📌Report the release success.
   */
  _reportSuccess() {
    this.scopedPackages.forEach(pkg => {
      log.success(`${chalk.reset(pkg)} ${chalk.green('✔ Released')}`);
    });
  }

  /**
   * 📌Set the scoped packages and paths to be used by the version command.
   * @example ./tools/abc-scripts/*
   */
  _setScopedPackages(projectPackages) {
    console.log(projectPackages);
    projectPackages.forEach(pkg => {
      if (pkg.name.match(new RegExp(this.scope))) {
        this.scopedPackages.push(pkg);
      }
    });

    if (!this.scopedPackages.length) {
      log.error(
        'Scoped packages',
        'None matching package for the passed scope!!!'
      );
    }
  }

  /**
   * The handler method called by Yarn to execute and process the release command.
   * @example
   * abc-scripts release "dls-components|abc-components"
   */
  handler = argv => {
    this.scope = argv.scope;
    this.scopedDependencies = argv.scopedDependencies;
    this.open = argv.open;
    console.log(this.scope);

    const spinner = new Ora({
      text: 'Loading lerna project packages',
      spinner: 'dots' // check more here https://github.com/sindresorhus/cli-spinners/blob/master/spinners.json
    });

    spinner.start();

    this.lernaProject
      .getPackages()
      .then(projectPackages => {
        spinner.succeed();
        this._setScopedPackages(projectPackages);
        server(this.scopedPackages, this.scopedDependencies, {
          open: this.open
        });
      })
      .catch(err => {
        log.error(err);
      });
  };
}

/**
 * Yargs command configuration.
 * @todo add a loglevel attribute for “silent”, “error”, “warn”, “info” or “verbose” logs.
 */
const YargsConfig = {
  command: 'graph',
  describe: 'Generates a dependency graph for the mono packages',
  builder: {
    scope: {
      describe: 'Glob for scoped packages',
      default: '.*',
      type: 'string'
    },
    scopedDependencies: {
      describe: 'Glob for scoped dependencies',
      default: '.*',
      type: 'string'
    },
    open: {
      describe: 'Open dependency graph in the browser',
      default: true,
      type: 'boolean'
    }
  }
};

const releaseCommand = new ReleaseCommand(YargsConfig);
const command = YargsConfig.command;
const builder = YargsConfig.builder;
const describe = YargsConfig.describe;
const handler = releaseCommand.handler;

export { command, describe, builder, handler };
