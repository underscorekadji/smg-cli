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
    const isHidden = args.silent || args.s || false;

    const employees = await getEmployeesByLocation(credentials, location);

    spinner.stop();

    if (!isHidden) {
      console.log(`Employees for ${location}:`);
      employees.forEach(employee => {
        console.log(`\t${employee.FirstNameEng} ${employee.LastNameEng}`);
        console.log(`\t\tLastName: ${employee.LastName}`);
        console.log(`\t\tFirstName: ${employee.FirstName}`);
        console.log(`\t\tMiddleName: ${employee.MiddleName}`);
        console.log(`\t\tDeptId: ${employee.DeptId}`);
        console.log(`\t\tGroup: ${employee.Group}`);
        console.log(`\t\tRank: ${employee.Rank}`);
        console.log(`\t\tDomenName: ${employee.DomenName}`);
        console.log(`\t\tEmail: ${employee.Email}`);
        console.log(`\t\tSkype: ${employee.Skype}`);
        console.log(`\t\tPhone: ${employee.Phone}`);
        console.log(`\t\tRoom: ${employee.Room}`);
        console.log(
          `\t\tEmploymentDate: ${new Date(
            parseInt(employee.EmploymentDate.substr(6))
          ).toUTCString()}`
        );
        console.log(`\t\tImage: ${employee.Image}`);
        console.log(
          `\t\tBirthday: ${new Date(
            parseInt(employee.Birthday.substr(6))
          ).toUTCString()}`
        );
        console.log(`\t\tProfileId: ${employee.ProfileId}`);
      });
    }

    if (filePath) {
      outputFile(filePath, JSON.stringify(employees, null, 2), function(err) {
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
