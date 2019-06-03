const ora = require("ora");
const path = require("path");
const logSymbols = require("log-symbols");
const outputFile = require("fs-extra").outputFile;
const inquirer = require("../lib/credentials");
const { getEmployeesByLocation } = require("../lib/smg");

module.exports = async args => {
  const credentials = await inquirer.askCredentials();
  const spinner = ora().start();

  try {
    const location = args.location || args.l;
    const filePath = args.file || args.f || "";
    const separator = args.separator || args.s || ";";

    const employees = await getEmployeesByLocation(credentials, location);

    spinner.stop();

    let result = "";

    employees.forEach(employee => {
      result += employee.Email + separator;
    });

    console.log(result);

    if (filePath) {
      outputFile(filePath, JSON.stringify(result, null, 2), function(err) {
        if (err) {
          console.error(err);
        } else {
          const fullPath = path.resolve(filePath);
          console.log(
            logSymbols.success,
            "The result of the execution was saved in a file:",
            fullPath
          );
        }
      });
    }
  } catch (err) {
    spinner.stop();
    console.error(logSymbols.error, "Error:", err.message);
  }
};
