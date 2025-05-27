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
    authorized({ auth, request }: { auth: { user?: { role?: string } } | null; request: { nextUrl: URL } }) {
      const isLoggedIn = !!auth?.user;
      const isAdmin = auth?.user?.role === 'admin';
      const isAdminPath = request.nextUrl.pathname.startsWith('/admin');
      
      if (isAdminPath) return isAdmin;
      return isLoggedIn;
    },
  },
};
