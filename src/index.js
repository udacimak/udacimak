#!/usr/bin/env node
/**
 * Entry point for commander
 */
import process from 'process';
import program from 'commander';
import {
  download,
  listNanodegrees,
  render,
  renderdir,
  setToken,
  login,
} from './commands';
import {
  logger,
  getFullErrorMessage,
  getPkgInfo,
} from './commands/utils';
import { preCli } from './cli';


const validateInt = (value) => {
  if (!parseInt(value)) { // eslint-disable-line
    console.error('--delay-youtube (-d) argument must be an integer');
    process.exit(1);
  }
};

program
  .version(`v${getPkgInfo().version}`, '-v, --version')
  .usage('<command> <args> [options]');

program
  .command('download')
  .description('Fetch course/Nanodegree data from Udacity and save them locally as JSON files.')
  .arguments('[courseid...]')
  .option('-t, --targetdir <targetdir>', 'Target directory to save downloaded course JSON data')
  .action(async (courseids, options) => {
    await preCli();

    const targetdir = options.targetdir || process.cwd();
    download(courseids, targetdir);
  })
  .on('--help', () => {
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
  .action(async () => {
    await preCli();
    listNanodegrees();
  });

program
  .command('render')
  .description('Render downloaded json course content into HTML by downloading all videos, creating text content, etc.')
  .arguments('<path>')
  .option('-t, --targetdir <targetdir>', '(Optional) Target directory to save rendered course contents')
  .option('-d, --delay-youtube <number>', '(Optional) Add delay in seconds between Youtube downloads')
  .option('-s, --subtitles', '(Optional) Download Youtube video subtitles')
  .option('-v, --verbose', '(Optional) Force youtube-dl to log debugging information')
  .option('--userquizanswer', '(Optional) Force rendering user\'s Programming Question code answer')
  .action(async (path, options) => {
    options.delayYoutube && validateInt(options.delayYoutube);

    await preCli();

    global.downloadYoutubeSubtitles = !!options.subtitles;

    const targetdir = options.targetdir || process.cwd();
    global.delayYoutube = options.delayYoutube || 0;
    global.ytVerbose = options.verbose;
    global.optRenderUserQuizAnswer = options.userquizanswer;

    render(path, targetdir);
  })
  .on('--help', () => {
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
  .option('-t, --targetdir <targetdir>', '(Optional) Target directory to save rendered course contents')
  .option('-d, --delay-youtube <number>', '(Optional) Add delay in seconds between Youtube downloads')
  .option('-s, --subtitles', '(Optional) Download Youtube video subtitles')
  .option('-v, --verbose', '(Optional) Force youtube-dl to log debugging information')
  .option('--userquizanswer', '(Optional) Force rendering user\'s Programming Question code answer')
  .action(async (path, options) => {
    options.delayYoutube && validateInt(options.delayYoutube);

    await preCli();

    global.downloadYoutubeSubtitles = !!options.subtitles;

    const targetdir = options.targetdir || process.cwd();
    global.delayYoutube = options.delayYoutube || 0;
    global.ytVerbose = options.verbose;
    global.optRenderUserQuizAnswer = options.userquizanswer;
    renderdir(path, targetdir);
  });

program
  .command('settoken')
  .description('Save Udacity authentication token locally.')
  .arguments('<token>')
  .action(async (token) => {
    await preCli();

    setToken(token);
  })
  .on('--help', () => {
    console.log('');
    console.log('NOTE: Log in to Udacity website and find _jwt key in your browser\'s cookies to get the token');
  });

program
  .command('login')
  .description('Login to audacity and save the token locally')
  .action(async () => {
    await preCli();
    login();
  });

program
  .parse(process.argv);


// handle uncaught exceptions and uncaught promise rejections
process.on('uncaughtException', (err) => {
  const errorMsg = getFullErrorMessage(err);
  logger.error(`Uncaught Exception:\n${errorMsg}`);
  process.exit(1);
});
process.on('unhandledRejection', (err) => {
  const errorMsg = getFullErrorMessage(err);
  logger.error(`Unhandled Promise Rejection:\n${errorMsg}`);
  process.exit(1);
});
