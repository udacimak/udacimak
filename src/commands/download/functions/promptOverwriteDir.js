import inquirer from 'inquirer';


/**
 * Prompt if user wants to overwrite the course/Nanodegree directory
 * @param {string} dir directory name
 */
export default async function promptOverwriteDir(dir) {
  const questions = [
    {
      type: 'confirm',
      name: 'overwriteExistingFolder',
      message: `The folder ${dir} already exists. Are you sure you want to write JSON data into this folder?`,
    },
  ];

  const answers = await inquirer.prompt(questions);
  return answers.overwriteExistingFolder;
}
