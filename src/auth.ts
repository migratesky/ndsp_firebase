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
        if (token.role) {
          session.user = { ...session.user, role: token.role as string };
        } else {
          session.user = { ...session.user, role: 'user' };
        }
      }
      return session;
    },
  },
};
