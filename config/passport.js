require('dotenv').config();
const passport = require('passport');
const GooglePlusTokenStrategy = require('passport-google-plus-token');
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');

// import user model
const User = require('../models/User');

passport.use(new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: process.env.JWT_SECRET
}, async (payload, done) => {
  try{
    // Find user specified in the token
    const user = await User.findById(payload.sub);

    // If user doesn't exist
    if(!user) {
      return done(null, false);
    }

    // Otherwise return the user
    done(null, user);

  } catch(error) {
    done(error, false);
  }
}));

passport.use('googleToken',new GooglePlusTokenStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:5000/users/oauth/google"
  },
  async (accessToken, refreshToken, profile, done) => {
    try{
    
        // Check for user if it exists
        const user = await User.findOne({ googleId: profile.id });
        if(user) {
          console.log('User already exists in database');
          return done(null,user);
        }
    
        // If new user
        console.log('New user');
        const newUser = new User({
          name: profile.displayName,
          googleId: profile.id,
          email: profile.emails[0].value
        });
    
        // saving the new user
        await newUser.save();
        done(null, newUser); 

    } catch(err) {
      done(err, false, err.message);
    }
  }
));