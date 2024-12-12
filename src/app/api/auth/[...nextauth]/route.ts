import connectMongo from '@lib/db';
import User from '@models/User';
import bcrypt from 'bcrypt';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        await connectMongo();

        const { username, password } = credentials || {};
        if (!username || !password) {
          throw new Error('Username and password are required');
        }

        const user = await User.findOne({ username })
          .select('+password')
          .select('+id');
        if (!user) {
          throw new Error('Invalid username or password');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          throw new Error('Invalid username or password');
        }

        return {
          id: user._id.toString(),
          username: user.username,
          email: user.email,
          role: user.role,
          solanaWallet: user.solanaWallet,
        };
      },
    }),
  ],
  secret: process.env.NEXT_AUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.username = user.username;
        token.image = user.image;
        token.role = user.role;
        token.solanaWallet = user.solanaWallet;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.id,
        email: token.email,
        name: token.name,
        username: token.username,
        image: token.image,
        role: token.role,
        solanaWallet: token.solanaWallet || '',
      };
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/error',
  },
};
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
