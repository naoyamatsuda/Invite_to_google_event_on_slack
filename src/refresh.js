const axios = require("axios");
const qs = require("querystring");
const { readJsonFile } = require("./jsonFile");

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
        refresh_token: token.refreshToken
      },
      null,
      null,
      { encodeURIComponent: qs.unescape }
    )
  };
};

const app = async callbackApi => {
  const token = {
    refreshToken:
      "1%2F%2F0e7TtZhteKOj_CgYIARAAGA4SNwF-L9IrE9726lbiAuU3oCJwzjc0P-5OOBzI6QeReIszUBd6JnEQ7v_vcShgUkVX_pWfmrJ_6x4"
  };
  const credential = await readJsonFile("oauthCredential.json").then(
    credentialJson => {
      if (!credentialJson.installed) {
        throw new Error("not found credentialJson info");
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
        throw new Error("not found creadetial info");
      return {
        clientId,
        projectId,
        authUri,
        tokenUri,
        clientSecret,
        redirectUri
      };
    }
  );
  const axiosconfig = createRefreshRequest(token, credential);
  const { access_token: accessToken } = await axios(axiosconfig)
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
};

module.exports = app();
