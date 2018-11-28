const inquirer = require("inquirer");

module.exports = {
  askCredentials: () => {
    const questions = [
      {
        name: "email",
        type: "input",
        message: "Enter your SMG username:",
        validate: function(value) {
          if (value.length) {
            return true;
          } else {
            return "Please enter your SMG username.";
          }
        }
      },
      {
        name: "password",
        type: "password",
        message: "Enter your password:",
        validate: function(value) {
          if (value.length) {
            return true;
          } else {
            return "Please enter your password.";
          }
        }
      }
    ];
    return inquirer.prompt(questions);
  }
};
