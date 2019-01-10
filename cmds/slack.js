const ora = require("ora");
const logSymbols = require("log-symbols");
const csv = require("csvtojson");
const inquirer = require("../lib/credentials");
const getEmployeesByLocation = require("../lib/smg");
const _ = require("lodash");

module.exports = async args => {
  const credentials = await inquirer.askCredentials();
  const spinner = ora().start();

  try {
    const location = args.location || args.l;
    const filePath = args.file || args.f;

    const employees = await getEmployeesByLocation(credentials, location);
    const jsonArray = await csv().fromFile(filePath);

    const extra = _.differenceWith(employees, jsonArray, (a, b) => {
      return a.Email.toLowerCase() === b.email.toLowerCase();
    });

    console.log(extra);

    spinner.stop();
  } catch (err) {
    spinner.stop();
    console.error(logSymbols.error, "Error:", err.message);
  }
};
