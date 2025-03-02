import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import bcrypt from 'bcryptjs';
import prisma from '../prisma/client';
import config from './index';


passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email, password, done) => {
      try {
        const user = await prisma.user.findUnique({ where: { email } });
        
        if (!user) {
          return done(null, false, { message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password!);
        if (!isMatch) {
          return done(null, false, { message: 'Invalid password' });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  ) as unknown as passport.Strategy
);

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.jwt.secret,
    },
    async (payload, done) => {
      try {
        const user = await prisma.user.findUnique({
          where: { id: payload.id },
        });
        
        if (!user) {
          return done(null, false);
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  ) as unknown as passport.Strategy
);

export { config }; 