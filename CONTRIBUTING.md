# Contributing to Udacimak

Thank you for considering to contribute to Udacimak!

## Submit Pull Request

### Start with your own branch
- Create a branch identifying the issue/feature you're working on:

  ```
  #ISSUE_NUMBER-DESCRIPTION
  ```

Example:

  ```
  #1-issue-description
  ```

### Set Up
- Uninstall `udacimak` if you have installed it globally:
  ```
  npm uninstall -g udacimak
  ```
- Install Node and npm. Installing via nvm is highly recommended:
  - https://github.com/creationix/nvm
  - https://github.com/coreybutler/nvm-windows
- Install required dependencies:
  ```shell
  npm install
  ```
- Run script build
  ```shell
  npm run-script build
  ```
- Create [symlink](https://docs.npmjs.com/cli/link) for the package folder so
that you can run `udacimak` command:
  ```shell
  npm link
  ```
  Run `udacimak --help` and make sure that it works

Now you can start coding!

### Commit
Please [commit with clear commit messages](https://github.com/trein/dev-best-practices/wiki/Git-Commit-Best-Practices).
Udacimak doesn't have a change log file for each version release. The commits
are the way to read changes in a version, so clear and concise commit
messages are important.

### Coding Style and Tests
Make sure you run:
- `npm run link` for Javascript style check
- `npm test` and make sure all tests pass

### Finish
- Push your commits to Github
- [Create a pull request](https://help.github.com/articles/creating-a-pull-request/)

# License
By contributing, you agree that your contributions will be licensed under
its MIT License.
