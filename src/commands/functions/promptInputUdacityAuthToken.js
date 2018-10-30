import inquirer from 'inquirer';


/**
 * Prompt user input for Udacity authentication token
 */
export default function promptInputUdacityAuthToken() {
  const questions = [
    {
      type: 'input',
      name: 'udacityAuthToken',
      message: "Enter Udacity authentication token (Log in to Udacity website and find _jwt key in your browser's cookies to get the token):"
    },
  ];

  return inquirer
    .prompt(questions)
    .then(answers => {
      return answers.udacityAuthToken;
    });
}