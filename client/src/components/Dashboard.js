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
const { DateTime } = require("luxon");


export default function Dashboard({ code }) {
  const accessToken = useAuth(code);
  const [username, setUsername] = useState("");
  const [oneYear, setOneYear] = useState(false)
  const [twoYear, setTwoYear] = useState(false)
  const [threeYear, setThreeYear] = useState(false)
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

  const changeOneYearState = () => {
    if (oneYear) {
      setOneYear(false)
    } else {
      setOneYear(true)
    }
  }
  const changeTwoYearState = () => {
    if (twoYear) {
      setTwoYear(false)
    } else {
      setTwoYear(true)
    }
  }
  const ChangeThreeYearState = () => {
    if (threeYear) {
      setThreeYear(false)
    } else {
      setThreeYear(true)
    }
  }

  const getPastDate = (years) => {
    let date = DateTime.local()
      .setZone("America/New_York")
      .minus({ years: years })
      .toFormat("ccc, dd LLL yyyy");
    return date;
  };

  const filterByYear = (years) => {
    const date = getPastDate(years)
    console.log(date)
    const filteredCheckins = checkins.filter(checkin => checkin.created_at.includes(date))
    if (filteredCheckins.length === 0) {
      return <p>no beers this day!</p>
    }
    return filteredCheckins.map((checkin) => (
      <Checkin key={checkin.checkin_id} checkin={checkin} />
    ))
  }
  return (
    <div>
      <h1>Welcome {username}</h1>
      <button onClick={changeOneYearState}>1 Year Ago Today</button>
      {oneYear && filterByYear(1)}
      <button onClick={changeTwoYearState}>2 Years Ago Today</button>
      {twoYear && filterByYear(2)}
      <button onClick={ChangeThreeYearState}>3 Year Ago Today</button>
      {threeYear && filterByYear(3)}
      <div>
        {checkins.map((checkin) => (
          <Checkin key={checkin.checkin_id} checkin={checkin} />
        ))}
      </div>
    </div>
  );
}
