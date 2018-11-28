const { name } = require("../package.json");

const menus = {
  main: `
    ${name} [command] <options>
    stuff .............. show employees
    version ............ show package version
    help ............... show help menu for a command
    `,

    stuff: `
    ${name} stuff <options>
    --location, -l ..... the location of an office
    --file, -f ......... the file path to save result
    --silent, -s ....... the argument to hide result from console (default = false)
    `,
};

module.exports = args => {
  const subCmd = args._[0] === "help" ? args._[1] : args._[0];
  console.log(menus[subCmd] || menus.main);
};
