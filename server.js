const express = require("express");
const next = require("next");

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();
const axios = require("axios");
const cookieParser = require("cookie-parser");
const { signedCookie } = require("cookie-parser");

const AUTH_USER_TYPE = "authenticated";
const COOKIE_SECRET = "fdghnru3y98y48@#45";
const COOKIE_OPTION = {
  httpOnly: true,
  secure: !dev,
  signed: true,
};

const authenticate = async (email, password) => {
  const { data } = await axios.get(
    "https://jsonplaceholder.typicode.com/users"
  );
  return data.find((user) => {
    if (user.email === email && user.website === password) {
      return user;
    }
  });
};

app.prepare().then(() => {
  const server = express();

  server.use(express.json());
  server.use(cookieParser(COOKIE_SECRET));

  server.post("/api/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await authenticate(email, password);
    if (!user) {
      return res.status(403).send("invalid email or password");
    }
    const userData = {
      name: user.name,
      email: user.email,
      type: AUTH_USER_TYPE,
    };
    res.cookie("token", userData, COOKIE_OPTION);
    res.json(userData);
  });

  server.get("/api/profile", async (req, res) => {
    const { signedCookies = {} } = req;
    const { token } = signedCookies;
    if (token && token.email) {
      const { data } = await axios.get(
        "https://jsonplaceholder.typicode.com/users"
      );
      const userProfile = data.find((user) => user.email === token.email);
      return res.json({ user: userProfile });
    }
    res.sendStatus(404);
  });

  server.all("*", (req, res) => {
    return handle(req, res);
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
