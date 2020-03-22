const fsPromises = require("fs").promises;
require("../oauthCredential");

const jsonparseAsync = json => {
  return new Promise((resolve, reject) => {
    if (!json) return reject(Error("undeifned json"));
    try {
      return resolve(JSON.parse(json));
    } catch (e) {
      return reject(e);
    }
  });
};

module.exports.readJsonFile = async path => {
  const tokenFile = await fsPromises.readFile(path).catch(e => {
    throw e;
  });

  const result = await jsonparseAsync(tokenFile)
    .then(json => {
      if (!json) throw new Error("json file is empty");
      if (!Object.keys(json).length) throw new Error("json is Undefined");
      return json;
    })
    .catch(e => {
      console.log(e);
      throw e;
    });

  return result;
};

module.exports.writeJsonFile = async (path, json) => {
  let jsonString;
  try {
    jsonString = JSON.stringify(json);
  } catch (e) {
    console.log("json sgtinfy error");
    throw e;
  }
  const result = await fsPromises.writeFile(path, jsonString).catch(err => {
    console.log("Access token write failure");
    throw err;
  });
  return result;
};
