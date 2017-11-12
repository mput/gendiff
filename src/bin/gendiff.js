#!/usr/bin/env node
import program from 'commander';
import genDiff from '../';

program
  .version('0.2.1')
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'Output format')
  .arguments('<firstConfig> <secondConfig>')
  .action((firstConfig, secondConfig, options) =>
    console.log(genDiff(firstConfig, secondConfig, options.format)))
  .parse(process.argv);
