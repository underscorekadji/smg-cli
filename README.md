# smg-cli

The CLI app that gives access to data into SMG. [In Progress]

## Environment Setup

You can either use `npm` or `yarn` to run this application. Please pick one and follow below instructions.

*If you want to use `yarn` and don't have `yarn` installed on your local machine please execute below command to install `yarn`:*

```
npm install -g yarn
```

### Installing Dependencies

On the root directory of the project please execute **either one** of the below commands to install all the project dependencies. You don't have to run both commands, just pick one.

```
yarn install
```

**OR**

```
npm install
```

## Possible Cases

**Required SMG authentication**

### Get all emails related to the specified location

```
node bin/cli emails -l mogilev
```
