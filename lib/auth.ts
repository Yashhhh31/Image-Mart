import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase } from "./db";
import User from "../models/User";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "email@example.com",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "••••••••",
        },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        try {
          await connectToDatabase();
          const user = await User.findOne({ email: credentials.email });
          if (!user) {
            throw new Error("No user found with the provided email");
          }

          console.log(
            "User found. Password hash starts with $2:",
            user.password?.startsWith("$2"),
          );

          const isPasswordValid = await user.comparePassword(
            credentials.password,
          );

          if (!isPasswordValid) {
            throw new Error("Invalid Password");
          }

          return {
            id: user._id.toString(),
            email: user.email,
            role: user.role,
          };
        } catch (error) {
          console.error("Error during user authentication:", error);
          throw new Error("Invalid credentials");
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token, user }) {
      session.user.id = token.id as string;
      session.user.role = token.role as string;
      return session;
    },

    // for JWT
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};
