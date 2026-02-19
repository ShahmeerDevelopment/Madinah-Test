import { setCookie } from "cookies-next";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
const clientSecret = process.env.NEXT_PUBLIC_GOOGLE_SECRET;

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: clientId,
      clientSecret: clientSecret,
      authorization: { params: { scope: "openid profile email" } }, // Ensure correct scopes are set
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  baseUrl: process.env.NEXT_PUBLIC_SHAREABLE_URL,
  callbacks: {
    async signIn() {
      // Here you can add custom logic to handle user data after successful sign-in
      return true; // Return true to continue the sign-in process
    },
    async redirect({ url, baseUrl }) {
      // Handle redirection after sign-in or sign-out
      if (url.startsWith(baseUrl)) return url; // Allows redirect back to any page within the site
      return baseUrl;
    },
    async session({ session, token }) {
      // Additional session information can be passed here
      // session.user.id = token.sub; // Assuming the sub claim from Google contains the user id
      // return session;
      session.user.accessToken = token.access_token;
      return session;
    },
    async jwt({ token, account }) {
      // You can add additional token claims here if needed
      if (account?.access_token) {
        token.access_token = account.access_token;
        setCookie("google_token", account.access_token);
      }
      return token;
    },
  },
  session: {
    strategy: "jwt", // Use JWT for session strategy, or 'database' if you prefer server-side sessions
  },
  pages: {
    signIn: "/auth/signin", // Custom sign-in page, optional
    signOut: "/auth/signout", // Custom sign-out page, optional
    error: "/auth/error", // Error handling page, optional
  },
});
