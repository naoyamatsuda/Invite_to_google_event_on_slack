const axios = require("axios");
const qs = require("querystring");
const { readJsonFile } = require("../file/jsonFile");
const { writeToken } = require("./token");

const createRefreshRequest = (token, creadential) => {
  return {
    method: "POST",
    url: creadential.tokenUri,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    data: qs.stringify(
      {
        grant_type: "refresh_token",
        client_id: creadential.clientId,
        client_secret: creadential.clientSecret,
        refresh_token: token.refresh_token
      },
      null,
      null,
      { encodeURIComponent: qs.unescape }
    )
  };
};

const validCredentialJson = credentialJson => {
  return new Promise((resolve, reject) => {
    if (!credentialJson.installed) {
      return reject(new Error("not found credentialJson info"));
    }
    const {
      client_id: clientId,
      project_id: projectId,
      auth_uri: authUri,
      token_uri: tokenUri,
      client_secret: clientSecret,
      redirect_uris: redirectUri
    } = credentialJson.installed;

    if (
      !clientId ||
      !projectId ||
      !authUri ||
      !tokenUri ||
      !clientSecret ||
      !redirectUri
    )
      return reject(new Error("not found creadetial info"));

    return resolve({
      clientId,
      projectId,
      authUri,
      tokenUri,
      clientSecret,
      redirectUri
    });
  });
};

module.exports.refreshToken = async (token, callback) => {
  const credential = await readJsonFile("oauthCredential.json")
    .then(validCredentialJson)
    .catch(e => {
      throw e;
    });

  const axiosconfig = createRefreshRequest(token, credential);
  const refreshedToken = await axios(axiosconfig)
    .then(response => {
      if (!response || !response.data) {
        throw new Error("not found refresh token response data");
      }
      return response.data;
    })
    .catch(err => {
      console.log("Filed token refresh");
      console.log(err);
      throw err;
    });

  await writeToken({ ...token }, { access_token: refreshedToken.access_token });

  return callback(refreshedToken);
};
