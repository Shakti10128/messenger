import prisma from '@/app/libs/prismadb'

const getMessages = async(conversationId:string) => {
    try {
        const messages = await prisma.message.findMany({
            where:{
                // it should be: conversationId not conversationIds
                conversationIds:conversationId
            },
            include:{
                sender:true,
                seen:true
            },
            // keep the default order of message, coz the last message should at the last or bottom  of list
            orderBy:{
                createdAt:"asc"
            }
        });

        return messages;
    } catch (error:unknown) {
        console.log("error while getting the messages based on conversationId ",error);
        // we don't want to break out application so just return empty array
        return [];
    }
}

export default getMessages;