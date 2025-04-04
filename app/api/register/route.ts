import bcrypt from 'bcrypt'
import { NextResponse } from 'next/server';
import prisma from '@/app/libs/prismadb'


export async function POST(
    request:Request
){
     
    try {
        const body = await request.json();

        const {name,email,password} = body;

        //  check if there is any field missing or not
        if(!name || !email || !password) {
            return new NextResponse("Missing info",{status:400});
        }

        // check if user already exist or not
        const isUserExist = await prisma.user.findFirst({
            where:{
                email:email
            }
        });

        if(isUserExist){
            return new NextResponse("User already exsit",{status:409});
        }

        const hashedPassword = await bcrypt.hash(password,12);

        const user = await prisma.user.create({
            data:{
                name,
                email,
                hashedPassword
            }
        });

        return NextResponse.json(user);
    } catch (error) {
        console.log(error,"REGISTRATION_ERROR");
        return new NextResponse("Internal error",{status:500});
    }
    
}