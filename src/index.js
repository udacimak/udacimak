#!/usr/bin/env node
/**
 * Entry point for commander
 */
import process from 'process';
import program from 'commander';
import pkg from '../package.json';
import {
  download,
  listNanodegrees,
  render,
  renderdir,
  setToken
} from './commands/';


program
  .version(pkg.version, '-v, --version')
  .usage('<command> <args> [options]');

program
  .command('download')
  .description('Fetch course/Nanodegree data from Udacity and save them locally as JSON files.')
  .arguments('[courseid...]')
  .option('-t, --targetdir <targetdir>', 'Target directory to save downloaded course JSON data')
  .action((courseids, options) => {
    const targetdir = options.targetdir || process.cwd();
    download(courseids, targetdir);
  }).on('--help', () => {
    console.log('');
    console.log('Examples:');
    console.log('');
    console.log(' - Download a single course/Nanodegree');
    console.log('   $ udacimak download nd019');
    console.log(' - Download multiple courses/Nanodegrees');
    console.log('   $ udacimak download nd019 st101 ud611');
    console.log(' - Download multiple courses/Nanodegrees to a specified target directory');
    console.log('   $ udacimak download -t C:/downloads nd019 st101 ud611');
  });

program
  .command('listnd')
  .description('List user\'s enrolled and graduated Nanodegree')
  .action(() => {
    listNanodegrees();
  });

program
  .command('render')
  .description('Render downloaded json course content into HTML by downloading all videos, creating text content, etc.')
  .arguments('<path>')
  .option('-t, --targetdir <targetdir>', 'Target directory to save rendered course contents')
  .option('-v, --verbose', 'For youtube-dl to print various debugging information')
  .action((path, options) => {
    const targetdir = options.targetdir || process.cwd();
    global.ytVerbose = options.verbose;
    render(path, targetdir);
  }).on('--help', () => {
    console.log('');
    console.log('Examples:');
    console.log('');
    console.log(' - Render a course/Nanodegree to the current working directory by not specifying -t or --targetdir');
    console.log('   $ udacimak render C:/React');
    console.log(' - Render a course/Nanodegree to a specified target directory');
    console.log('   $ udacimak render -t C:/Udacity C:/React');
  });

program
  .command('renderdir')
  .description('Render a whole directory of downloaded json course contents')
  .arguments('<path>')
  .option('-t, --targetdir <targetdir>', 'Target directory to save rendered course contents')
  .option('-v, --verbose', 'For youtube-dl to print various debugging information')
  .action((path, options) => {
    const targetdir = options.targetdir || process.cwd();
    global.ytVerbose = options.verbose;
    renderdir(path, targetdir);
  });

program
  .command('settoken')
  .description('Save Udacity authentication token locally.')
  .arguments('<token>')
  .action(token => {
    setToken(token);
  }).on('--help', () => {
    console.log('');
    console.log(`NOTE: Log in to Udacity website and find _jwt key in your browser's cookies to get the token`);
  });

program
  .parse(process.argv);