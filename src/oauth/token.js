const appRoot = require("app-root-path");
const { readJsonFile, writeJsonFile } = require("../file/jsonFile");

module.exports.readToken = async () => {
  const result = await readJsonFile(`${appRoot}/token.json`).then(token => {
    if (!token.access_token || !token.refresh_token)
      throw new Error("not found token");
    return token;
  });
  return result;
};

module.exports.writeToken = async (oldToken, json) => {
  const registerToken = { ...oldToken, ...json };
  writeJsonFile("token.json", registerToken);
};
