import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "../../../../../prisma/prisma";
import bcrypt from "bcryptjs";



export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Email & Password",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "user@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          return null;
        }

        if (!user.password) {
          return null;
        }


        const isValidPassword = await bcrypt.compare(credentials.password, user.password);
        if (!isValidPassword) {
          return null;
        }

        return { id: user.id, username: user.username ?? "", email: user.email, role: user.role ?? "USER", province: user.province ?? "" };

      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  pages: {
    signIn: "/login",
  }, session: {
    strategy: "jwt",
  },


  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.username = user.username; 
        token.role = user.role;
        token.password = user.password; 
        token.province = user.province; 
      }
  
      // ✅ เช็คว่า token มี user ID ไหม แล้วดึงค่าล่าสุดจาก DB
      if (token.sub) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.sub }, // ค้นหาจาก user ID
        });
  
        if (dbUser) {
          token.username = dbUser.username; 
          token.password = dbUser.password; 

        }
      }
  
      return token;
    },
    async session({ session, user, token }) {
      session.user.username = token.username as string; 
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id as string,
          username: token.username as string,
          password: token.password as string,
          email: token.email as string,
          role: token.role as string,
          province: token.province as string, 
        }
      };
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
