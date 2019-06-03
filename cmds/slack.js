const ora = require("ora");
const logSymbols = require("log-symbols");
const csv = require("csvtojson");
const inquirer = require("../lib/credentials");
const { getEmployeesByLocation, getProfileByEmail } = require("../lib/smg");
const _ = require("lodash");

module.exports = async args => {
  const credentials = await inquirer.askCredentials();
  const spinner = ora().start();

  try {
    const location = args.location || args.l;
    const filePath = args.file || args.f;

    const employees = await getEmployeesByLocation(credentials, location);
    const jsonArray = await csv().fromFile(filePath);

    const missing = _.differenceWith(employees, jsonArray, (a, b) => {
      return a.Email.toLowerCase() === b.email.toLowerCase();
    });

    const extra = _.differenceWith(jsonArray, employees, (b, a) => {
      return a.Email.toLowerCase() === b.email.toLowerCase();
    });
    const extraMembers = _.remove(extra, user => {
      return user.status.toLowerCase() === "member";
    });

    spinner.stop();

    console.log(`Missing SMG users by location ${location}:`);
    missing.forEach(user => {
      console.log(`  ${user.Email}`);
    });

    console.log(`Extra Slack members:`);
    extraMembers.forEach(async user => {
      const { email } = user;
      const profile = await getProfileByEmail(
        credentials,
        email.substring(0, email.lastIndexOf("@"))
      );

      console.log(`  ${user.email}:`)
      if (profile) {
        console.log(`    Location: ${profile.Room}`);
      } else {
        console.log(`    User ${user.email} doesn't exist in SMG database.`);
      }
    });
  } catch (err) {
    spinner.stop();
    console.error(logSymbols.error, "Error:", err.message);
  }
};
