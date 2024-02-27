const GoogleStrategy = require("passport-google-oauth20").Strategy
const { User, Provider } = require("../models/index")

module.exports = new GoogleStrategy(
  {
    clientID: process.env.CLIENT_ID_GOOGLE,
    clientSecret: process.env.CLIENT_SECRET_GOOGLE,
    callbackURL: "https://compactlink.vercel.app/auth/google/callback",
    scope: ["profile", "email"],
  },
  async function (accessToken, refreshToken, profile, done) {
    const {
      displayName: name,
      emails: [{ value: email }],
      photos: [{ value: urlAvatar }],
    } = profile;
    const [provider] = await Provider.findOrCreate({
      where: {
        name: "google",
      },

      defaults: {
        name: "google",
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
        urlAvatar,
        status: true,
      },
    });
    return done(null, user);
  }
);