import getSession from "./getSession";
import prisma from '@/app/libs/prismadb'

const getUsers =  async()=>{
    const session = await getSession();

    if(!session?.user?.email){
        return [];
    }

    try {
        const users = await prisma.user.findMany({
            // whoever create the account latest will stay at the top
            orderBy:{
                createdAt:"desc"
            },
            where:{
                NOT:{
                    // we don't want ourself in that list so exclude ourself
                    email:session.user.email
                }
            }
        });

        return users;
    } catch (error:unknown) {
        console.log("error while getting users fron getUsers action",error);
        return [];
    }
}

export default getUsers;