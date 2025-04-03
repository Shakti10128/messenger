import bcrypt from 'bcrypt'
import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from 'next-auth/providers/google'
import GithubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from '@/app/libs/prismadb'


export const authOptions:AuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
        }),
        GithubProvider({
            clientId: process.env.GITHUB_ID as string,
            clientSecret: process.env.GITHUB_SECRET as string
        }),

        CredentialsProvider({
            name:"Email",
            credentials:{
                email:{label:"email", type:"text"},
                password:{label:"password",type:"password"}
            },

            async authorize(credentials){
                // check user input credentials or not
                if(!credentials?.email || !credentials.password) {
                    throw new Error("Invalid Credentialss");
                }

                // db level checking for user exist or not
                const user = await prisma.user.findFirst({
                    where:{
                        email:credentials.email
                    }
                });
                /* !user: based on user input if user doesn't found
                   !user.hashedPassword: mean's user has setup it's
                   account via google or github not explictly setup any password */
                if(!user || !user?.hashedPassword){
                    throw new Error("Invalid Credentialss");
                }

                const isHashedPasswordMatche = await bcrypt.compare(credentials.password, user.hashedPassword);
                // user has entered wrong password
                if(!isHashedPasswordMatche){
                    throw new Error("Invalid Credentialss");
                }

                // mean's everything is ok!
                return user;
            }
        })
    ],
    debug: process.env.NODE_ENV === 'development',
    session:{
        strategy:"jwt"
    },
    secret:process.env.NEXTAUTH_SECRET
}

const handler = NextAuth(authOptions)
export {handler as get, handler as POST};