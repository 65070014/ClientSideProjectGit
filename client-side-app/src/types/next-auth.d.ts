import NextAuth from "next-auth";
declare module "next-auth" {
    interface User {
        username: string;
        password: string;
        role: string;
        province: string, 

    }
    interface Session {
        user: User & { 
            username: string,
            password: string,
            province: string,
            role: string 
        }
        token: {
            username: string,
            password: string;
            province: string,
            role: string
        }
    }
}
    