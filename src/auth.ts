import NextAuth from 'next-auth';
import { authConfig, middlewareAuthConfig } from './auth.config';
import type { Session, TokenSet } from 'next-auth';

export default NextAuth(authConfig);

export const authOptions = {
  ...authConfig,
  callbacks: {
    ...authConfig.callbacks,
    async session({ session, token }: { session: Session; token: TokenSet }) {
      if (session?.user) {
        session.user.role = token.role || 'user';
      }
      return session;
    },
  },
};
