import NextAuth, { AuthOptions } from "next-auth"
import GitHubProvider from "next-auth/providers/github"

export const authOptions: AuthOptions = {
    providers: [
        ...(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET ? [
            GitHubProvider({
                clientId: process.env.GITHUB_CLIENT_ID,
                clientSecret: process.env.GITHUB_CLIENT_SECRET,
                authorization: {
                    params: {
                        scope: "read:user user:email repo",
                    }
                }
            })
        ] : [])
    ],
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    cookies: {
        sessionToken: {
            name: `__Secure-next-auth.session-token`,
            options: {
                httpOnly: true,
                sameSite: 'lax',
                path: '/',
                secure: true,
                maxAge: 30 * 24 * 60 * 60 // 30 days
            }
        }
    },
    pages: {
        signIn: '/login',
    },
    callbacks: {
        async signIn({ user, account, profile }) {
            return true;
        },
        async jwt({ token, account, profile, user }) {
            if (account) {
                token.accessToken = account.access_token;
                token.provider = account.provider;
                token.id = user?.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                (session as any).accessToken = token.accessToken;
                (session as any).provider = token.provider;
                if (session.user) {
                    (session.user as any).id = token.id;
                }
            }
            return session;
        },
        async redirect({ url, baseUrl }) {
            if (url.startsWith(baseUrl)) return url;
            else if (url.startsWith('/')) return `${baseUrl}${url}`;
            return `${baseUrl}/ide`;
        },
    },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
