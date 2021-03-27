import React, { useEffect, useState } from "react";
import useAuth from "./useAuth";
import Checkin from "./BeerList";
import axios from "axios";
const UntappdClient = require("node-untappd");
require("dotenv").config();
const debug = false;
const clientId = process.env.CLIENTID;
const clientSecret = process.env.CLIENTSECRET;
const untappd = new UntappdClient(debug);

export default function Dashboard({ code }) {
  const accessToken = useAuth(code);
  const [username, setUsername] = useState("");
  const [checkins, setCheckins] = useState([]);
  var allCheckins = [];
  untappd.setAccessToken(accessToken);
  untappd.setClientId(clientId);
  untappd.setClientSecret(clientSecret);

  // use effect to get user info

  const getAllCheckins = (maxId) => {
    axios
      .get(`https://api.untappd.com/v4/user/checkins`, {
        params: {
          access_token: accessToken,
          limit: 100,
          max_id: maxId,
        },
      })
      .then((res) => {
        res.data.response.checkins.items.forEach((item) => {
          allCheckins.push(item);
        });
        return (maxId = res.data.response.pagination.max_id);
      })
      .then((maxId) => {
        console.log("maxid", maxId);
        if (maxId > 0) {
          getAllCheckins(maxId);
        } else {
          console.log("all done!");
          setCheckins(allCheckins);
        }
      });
  };
  useEffect(() => {
    if (!accessToken) return;
    untappd.userInfo(function (err, obj) {
      if (err) {
        console.log(err);
      } else {
        let user = obj.response.user.user_name;
        setUsername(user);
      }
    });
  }, [accessToken]);

  useEffect(() => {
    if (!accessToken) return;
    getAllCheckins();
  }, [accessToken]);
  //map over beer here and pass in to Beer list, don't map in beerlist
  return (
    <div>
      <h1>Welcome {username}</h1>
      <div>
        {checkins.map((checkin) => (
          <Checkin key={checkin.checkin_id} checkin={checkin} />
        ))}
      </div>
    </div>
  );
}
