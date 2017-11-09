#!/usr/bin/env node
import program from 'commander';
import genDiff from '../';

program
  .version('0.1.2')
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'Output format')
  .arguments('<firstConfig> <secondConfig>')
  .action((firstConfig, secondConfig, type) =>
    console.log(genDiff(firstConfig, secondConfig, type)))
  .parse(process.argv);
