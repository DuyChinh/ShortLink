var GitHubStrategy = require("passport-github2").Strategy;
const { Provider, User } = require("../models/index");

module.exports = new GitHubStrategy(
  {
    clientID: process.env.CLIENT_ID_GITHUB,
    clientSecret: process.env.CLIENT_SECRET_GITHUB,
    callbackURL: "https://compactlink.vercel.app/auth/github/callback",
    scope: ["profile", "email"],
  },
  async function (accessToken, refreshToken, profile, done) {
    const {
      username: name,
      profileUrl: email,
      photos: [{ value: urlAvatar }],
    } = profile;
    const [provider] = await Provider.findOrCreate({
      where: {
        name: "github",
      },
      defaults: {
        name: "github",
      },
    });
    const [user] = await User.findOrCreate({
      where: {
        email,
        provider_id: provider.id,
      },
      defaults: {
        name,
        email,
        provider_id: provider.id,
        status: true,
        accessToken,
        urlAvatar,
      },
    });
    return done(null, user);
  }
);
