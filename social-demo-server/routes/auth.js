const { v4: uuidv4 } = require("uuid");

const authRoutes = (app, { hgetAsync, hsetAsync, hmsetAsync, incrAsync }) => {
  app.post("/login", async (req, res, next) => {
    if (!req.body.username || !req.body.password) {
      res.status(400);
      return next(new Error("Invalid parameter"));
    }
    const userId = await hgetAsync("users", req.body.username);
    const password = await hgetAsync(`user:${userId}`, "password");
    if (!userId || !password || password !== req.body.password) {
      res.status(400);
      return next(new Error("Invalid username or password"));
    }
    const authSecret = await hgetAsync(`user:${userId}`, "auth");
    const userName = await hgetAsync(`user:${userId}`, "username");
    // set secret in cookie
    res.cookie("secret", authSecret, { httpOnly: true });
    res.status(200).json({ data: { userName, userId } });
  });

  app.post("/register", async (req, res, next) => {
    if (!req.body.username || !req.body.password) {
      res.status(400);
      return next(new Error("Invalid parameter"));
    }
    const { username, password } = req.body;
    // check if username existing
    const existingUser = await hgetAsync("users", username.trim());
    if (existingUser) {
      res.status(400);
      return next(new Error("Username is already taken"));
    }
    const userId = await incrAsync("next_user_id");
    const authSecret = uuidv4();
    // add user
    await hmsetAsync(`user:${userId}`, [
      "username",
      username,
      "password",
      password,
      "auth",
      authSecret,
    ]);
    // add users
    await hsetAsync("users", username, userId);
    // add auth
    await hsetAsync("auths", authSecret, userId);
    res.cookie("secret", authSecret, { httpOnly: true });
    res.status(200).json({ data: { username, userId } });
  });

  app.get("/logout", (_req, res) => {
    res.status(200).clearCookie("secret").json({ message: "logout success" });
  });
};

const isAuthorized = (req, res, next) => {
  if (!req.cookies || !req.cookies.secret) {
    res.status(401);
    return next(new Error("Unauthorized"));
  }
  req.secret = req.cookies.secret;
  next();
};

module.exports = { authRoutes, isAuthorized };
