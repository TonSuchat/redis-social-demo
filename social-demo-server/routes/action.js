const { isAuthorized } = require("./auth");
const { convertUnixToString, getCurrentUnixTimeStamp } = require("../helpers");

const getUserIdBySecret = async (req, hgetAsync) => {
  const secret = req.secret;
  return await hgetAsync("auths", secret);
};

const getPostsByUserId = async (
  userId,
  lrangeAsync,
  hgetallAsync,
  hgetAsync,
) => {
  const postIds = await lrangeAsync(`posts:${userId}`, 0, -1);
  return await transformPostIdsToPostDatas(
    postIds,
    hgetallAsync,
    hgetAsync,
  );
};

const transformPostIdsToPostDatas = async (
  postIds,
  hgetallAsync,
  hgetAsync,
) => {
  const posts = [];
  for (const postId of postIds) {
    const postData = await hgetallAsync(`post:${postId}`);
    const userName = await hgetAsync(`user:${postData.user_id}`, "username");
    posts.push(
      {
        postId,
        userId: postData.user_id,
        username: userName,
        content: postData.body,
        postedDateTime: convertUnixToString(postData.time),
      },
    );
  }
  return posts;
};

const actionRoutes = (
  app,
  {
    hgetAsync,
    hgetallAsync,
    hmsetAsync,
    incrAsync,
    zrangeAsync,
    lpushAsync,
    ltrimAsync,
    lrangeAsync,
    zaddAsync,
    zrankAsync,
    zremAsync,
    zcardAsync,
  },
) => {
  app.post("/post", isAuthorized, async (req, res, next) => {
    try {
      if (!req.body.content) {
        res.status(400);
        return next(new Error("Invalid parameters"));
      }
      const userId = await getUserIdBySecret(req, hgetAsync);
      if (!userId) return next(new Error("Not found userId"));
      const userName = await hgetAsync(`user:${userId}`, "username");
      // create post
      const postId = await incrAsync("next_post_id");
      const unixTimeStamp = getCurrentUnixTimeStamp();
      await hmsetAsync(
        `post:${postId}`,
        [
          "user_id",
          userId,
          "time",
          unixTimeStamp,
          "body",
          req.body.content,
        ],
      );
      // get the followers
      let followers = await zrangeAsync(`followers:${userId}`, 0, -1);
      followers = [...followers, userId];
      // add postId to all followers, including post owner
      for (const fid of followers) {
        await lpushAsync(`posts:${fid}`, postId);
      }
      // push the post to the timeline
      await lpushAsync("timeline", postId);
      // then trim it for make it 1000 newest posts
      await ltrimAsync("timeline", 0, 1000);
      const newPost = {
        postId,
        username: userName,
        content: req.body.content,
        postedDateTime: convertUnixToString(unixTimeStamp),
      };
      res.json({ ...newPost });
    } catch (error) {
      return next(error);
    }
  });

  app.get("/post", isAuthorized, async (req, res, next) => {
    try {
      const userId = await getUserIdBySecret(req, hgetAsync);
      const posts = await getPostsByUserId(
        userId,
        lrangeAsync,
        hgetallAsync,
        hgetAsync,
      );
      res.json(posts);
    } catch (error) {
      return next(error);
    }
  });

  app.get("/profile/:userId", isAuthorized, async (req, res, next) => {
    try {
      if (!req || !req.params || !req.params.userId) {
        res.status(400);
        return next(new Error("Invalid parameter"));
      }
      const userId = await getUserIdBySecret(req, hgetAsync);
      const { userId: profileUserId } = req.params;
      const posts = await getPostsByUserId(
        profileUserId,
        lrangeAsync,
        hgetallAsync,
        hgetAsync,
      );
      const username = await hgetAsync(`user:${profileUserId}`, "username");
      // check user is already following this user profile
      const rank = await zrankAsync(`followings:${userId}`, profileUserId);
      const isFollowing = (rank !== null && rank !== undefined && +rank >= 0)
        ? true
        : false;

      res.json(
        { username, isFollowing, posts },
      );
    } catch (error) {
      return next(error);
    }
  });

  app.get("/followCount", isAuthorized, async (req, res, next) => {
    try {
      const userId = await getUserIdBySecret(req, hgetAsync);
      const followings = await zcardAsync(`followings:${userId}`);
      const followers = await zcardAsync(`followers:${userId}`);
      res.json({ followers, followings });
    } catch (error) {
      return next(error);
    }
  });

  app.get("/timeline", async (_req, res, next) => {
    try {
      const postIds = await lrangeAsync("timeline", 0, 100);
      res.json(
        await transformPostIdsToPostDatas(postIds, hgetallAsync, hgetAsync),
      );
    } catch (error) {
      return next(error);
    }
  });

  app.post("/follow", isAuthorized, async (req, res, next) => {
    try {
      if (!req.body.followUserId) {
        res.status(400);
        return next(new Error("Invalid parameter"));
      }
      const followUserId = req.body.followUserId;
      const userId = await getUserIdBySecret(req, hgetAsync);
      if (!userId) {
        res.status(401);
        return next("secret key is invalid");
      }
      const score = getCurrentUnixTimeStamp();
      // followers, add our userid followers:followUserId
      await zaddAsync(`followers:${followUserId}`, score, userId);
      // following, add followUserId to followings:userId
      await zaddAsync(`followings:${userId}`, score, followUserId);
      res.json(true);
    } catch (error) {
      return next(error);
    }
  });

  app.delete(
    "/unfollow/:unfollowUserId",
    isAuthorized,
    async (req, res, next) => {
      try {
        if (!req.params.unfollowUserId) {
          res.status(400);
          return next(new Error("Invalid parameter"));
        }
        const userId = await getUserIdBySecret(req, hgetAsync);
        if (!userId) {
          res.status(401);
          return next(new Error("Invalid secret"));
        }
        const unfollowUserId = req.params.unfollowUserId;
        // remove follwers
        await zremAsync(`followers:${unfollowUserId}`, userId);
        // remove followings
        await zremAsync(`followings:${userId}`, unfollowUserId);
        res.json(true);
      } catch (error) {
        return next(error);
      }
    },
  );
};

module.exports = actionRoutes;
