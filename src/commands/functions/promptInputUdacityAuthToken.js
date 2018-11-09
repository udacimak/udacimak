import inquirer from 'inquirer';


/**
 * Prompt user input for Udacity authentication token
 */
export default async function promptInputUdacityAuthToken() {
  const questions = [
    {
      type: 'input',
      name: 'udacityAuthToken',
      message: "Enter Udacity authentication token (Log in to Udacity website and find _jwt key in your browser's cookies to get the token):",
    },
  ];

  const answers = await inquirer.prompt(questions);
  return answers.udacityAuthToken;
}
