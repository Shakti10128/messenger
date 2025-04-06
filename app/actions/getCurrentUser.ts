import getSession from "./getSession";
import prisma from '@/app/libs/prismadb'


const getCurrentUser = async()=>{
    try {
        const session = await getSession();
        
        // if there is no user
        if(!session?.user?.email){
            return null;
        }

        // check user exist in db or not
        const currentUser = await prisma.user.findUnique({
            where:{
                email:session.user.email as string
            }
        });

        if(!currentUser) {
            return null;
        }

        return currentUser;
    } // we don't want to break our app so return null, it's not an api call, it's simple server action 
    catch (error:unknown) {
        console.log("error while geting user details from getCurrentUser action ",error);
        return null;
    }
}

export default getCurrentUser;
