import type { NextAuthOptions } from 'next-auth';

export const authConfig: NextAuthOptions = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async signIn() {
      return true;
    },
    async redirect({ baseUrl }) {
      return baseUrl;
    },
    async session({ session }) {
      return session;
    },
    async jwt({ token }) {
      return token;
    }
  },
  providers: [],
};

export const middlewareAuthConfig = {
  callbacks: {
    authorized() {
      // Temporarily allow all routes during testing
      return true;
    }
  }
};
