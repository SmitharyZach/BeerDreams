import React from "react";

const AUTH_URL =
  "https://untappd.com/oauth/authenticate/?client_id=0CC7305F425B6E6D5AF89F21C8B6699F9E990499&response_type=code&redirect_url=http://localhost:3000";

export default function Login() {
  return <div>
      <a href={AUTH_URL}>Login with Untappd</a>
  </div>;
}
