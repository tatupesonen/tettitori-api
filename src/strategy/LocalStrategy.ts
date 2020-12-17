import passport from 'passport';
import User from '../schema/User';

const { LocalStrategy } = require('passport-local');


passport.use(new LocalStrategy(
    function(username: string, password: string, done: Function) {
      User.findOne({ username: username }, function (err: any, user: any) {
        if (err) { return done(err); }
        if (!user) { return done(null, false); }
        if (!user.verifyPassword(password)) { return done(null, false); }
        return done(null, user);
      });
    }
));