const createInstance = require("@smg/client").createInstance;
const _ = require("lodash");
const host =
  "https://smg.itechart-group.com/MobileServiceNew/MobileService.svc";

module.exports = async (credentials, location) => {
  const instance = await createInstance(
    credentials.email,
    credentials.password,
    host
  );

  const employees = await instance.getAllEmployees();
  const shortList = _.filter(employees.data.Profiles, function(profile) {
    return profile.Room.toLowerCase().indexOf(location) !== -1;
  });

  let promises = [];

  shortList.forEach(profile => {
    promises.push(
      instance
        .getEmployeeDetails(profile.ProfileId)
        .then(response => {
          return response.data.Profile;
        })
        .catch(error => {
          console.error("Error: ", error);
        })
    );
  });

  const result = Promise.all(promises).then(data => {
    return data;
  });

  return result;
};
