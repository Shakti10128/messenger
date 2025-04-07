import prisma from '@/app/libs/prismadb'
import getCurrentUser from './getCurrentUser'


const getConversations = async()=>{
    const currentUser = await getCurrentUser();

    // check if the current user exist or not with auth
    if(!currentUser?.id){
        return [];
    }

    try {
        const conversations = await prisma.conversation.findMany({
            // get the last conversation first so that it can stay at top of conversation display
            orderBy:{
                lastMessageAt:"desc"
            },
            // we want only those conversation which has been done by currentUser
            where:{
                userIds:{
                    has:currentUser.id
                }
            },
            include:{
                // populate the user details
                users:true,
                // also populate the messages with sender who has sent the message & by whom the message seen
                messages:{
                    include:{
                        sender:true,
                        seen:true
                    }
                }
            }
        });
        return conversations;
    } catch (error:unknown) {
        console.log("error while getting conversations from getConversations action: ",error);
        // why return empty array, coz we don't want to break our application
        return [];
    }
}

export default getConversations;