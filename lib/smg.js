const createInstance = require("@smg/client").createInstance;
const _ = require("lodash");
const host =
  "https://smg.itechart-group.com/MobileServiceNew/MobileService.svc";

var SMGInstance = (function() {
  var instance;

  async function create(credentials, host) {
    return await createInstance(credentials.email, credentials.password, host);
  }

  return {
    getInstance: async function(credentials, host) {
      if (!instance) {
        instance = await create(credentials, host);
      }
      return instance;
    }
  };
})();

module.exports.getEmployeesByLocation = async (credentials, location) => {
  const instance = await SMGInstance.getInstance(credentials, host);

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

module.exports.getProfileByEmail = async (credentials, domainName) => {
  const instance = await SMGInstance.getInstance(credentials, host);
  const [firstname, lastname] = domainName.split(".");
  console.log({ firstname, lastname });
  const employees = await instance.getAllEmployees();
  const { Profiles } = employees.data;
  const candidatesIds = _.filter(
    Profiles,
    profile => profile.LastNameEng.toLowerCase().indexOf(lastname) !== -1
  ).map(_ => _.ProfileId);

  if (!candidatesIds || candidatesIds.length === 0) return undefined;

  const promises = [];

  candidatesIds.forEach(id => {
    promises.push(
      instance
        .getEmployeeDetails(id)
        .then(response => {
          const { Profile } = response.data;
          return Profile;
        })
        .catch(error => {
          throw new Error("Error: ", error);
        })
    );
  });

  const result = await Promise.all(promises).then(data => data);
  const profile = _.find(
    result,
    obj => obj.DomenName.toLowerCase() === domainName
  );

  return profile;
};
