import prisma from '@/app/libs/prismadb'
import getCurrentUser from './getCurrentUser';



const getConversationById = async(conversationId:string) => {
    try {
        const currentUser = await getCurrentUser();
        // fist checking either the user exist or not
        if(!currentUser?.email) {
            return null;
        }

        // finding the unique conversation based on the conversationId
        const conversation = await prisma.conversation.findUnique({
            where:{
                id:conversationId
            },
            // include user also to display their name & profile picture or something else
            include:{
                users:true
            }
        });

        return conversation;
    } catch (error:unknown) {
        console.log("error while getting the conversation by conversationId", error);
        // we don't want to break out application so just return null with console error
        return null;
    }
}

export default getConversationById;