const express = require("express");
const UntappdClient = require("node-untappd");
const cors = require("cors");
var request = require("request");
require("dotenv").config();
const debug = false;
const untappd = new UntappdClient(debug);
const clientId = process.env.CLIENTID;
const clientSecret = process.env.CLIENTSECRET;
untappd.setClientId(clientId);
untappd.setClientSecret(clientSecret);
const app = express();

app.use(express.json());
app.use(cors());
app.post("/login", (req, res) => {
  const code = req.body.code;
  const getAccessToken = `https://untappd.com/oauth/authorize/?client_id=${clientId}&client_secret=${clientSecret}&response_type=code&redirect_url=http://localhost:3000&code=${code}`;
  console.log(getAccessToken);
  request(getAccessToken, function (error, response, body) {
    jsonBody = JSON.parse(body);
    if (!error && response.statusCode === 200) {
      res.json(jsonBody);
    } else {
      res.json(error);
    }
  });
});
app.listen(3001);
