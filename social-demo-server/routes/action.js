const { isAuthorized } = require("./auth");

const actionRoutes = (
  app,
  { hgetAsync, hmsetAsync, incrAsync, zrangeAsync, lpushAsync, ltrimAsync },
) => {
  app.post("/post", isAuthorized, async (req, res, next) => {
    if (!req.body.content) {
      res.status(400);
      return next(new Error("Invalid parameters"));
    }
    const secret = req.secret;
    const userId = await hgetAsync("auths", secret);
    if (!userId) return next(new Error("Not found userId"));
    // create post
    const postId = await incrAsync("next_post_id");
    await hmsetAsync(
      `post:${postId}`,
      [
        "user_id",
        userId,
        "time",
        new Date().getTime() / 1000,
        "body",
        req.body.content,
      ],
    );
    // get the followers
    let followers = await zrangeAsync(`followers:${userId}`, 0, -1);
    followers = [...followers, userId];
    // add postId to all followers, including post owner
    followers.forEach(async (fid) => await lpushAsync(`posts:${fid}`, postId));
    // push the post to the timeline
    await lpushAsync("timeline", postId);
    // then trim it for make it 1000 newest posts
    await ltrimAsync("timeline", 0, 1000);
    res.json({ userId });
  });
};

module.exports = actionRoutes;
