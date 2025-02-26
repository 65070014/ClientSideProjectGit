import { NextResponse } from "next/server"
import { prisma } from "../../../../prisma/prisma";
import bcrypt from "bcryptjs"; 
import * as z from "zod";

const userSchema = z.object({
    username: z.string().min(1,'Username is required').max(100),
    email: z.string().min(1,'Email is required').email('Invalid email'),
    password: z.string().min(1,'Password is required').min(8,'Password must have than 8 characters'),
    confirmPassword: z.string().min(1,'Confirm Password is required')
})


export async function POST(req: Request){
    try {
        const body = await req.json();
        const {email,username,password} = userSchema.parse(body);

        const existingUserByEmail = await prisma.user.findUnique({
            where: {
                email: email
            }   
        });
        if(existingUserByEmail){
            return NextResponse.json({user:null,message: "User with this email already exists"},{status: 409})
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await prisma.user.create({
            data: { 
                email, 
                username, 
                password: hashedPassword ,
                role: "USER"
            }
        })
        const {password : newUserPassword, ...user} = newUser;
        return NextResponse.json({user: newUser,message: "User created successfully"},{status: 201})
    }catch(error){
        return NextResponse.json({error ,message: "Something went wrong!"},{status: 500})
    }
}