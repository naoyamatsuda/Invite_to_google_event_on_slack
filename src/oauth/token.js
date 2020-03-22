const { readJsonFile, writeJsonFile } = require("../file/jsonFile");

module.exports.readToken = async () => {
  const result = await readJsonFile("../../token.json").then(token => {
    if (!token.access_token || !token.refresh_token)
      throw new Error("not found token");
    return token;
  });
  return {
    accessToken: result.access_token,
    refreshToken: result.refresh_token
  };
};

module.exports.writeToken = async (oldToken, json) => {
  const registerToken = { ...oldToken, ...json };
  writeJsonFile("token.json", registerToken);
};
