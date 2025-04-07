
import getCurrentUser from '@/app/actions/getCurrentUser';
import prisma from '@/app/libs/prismadb'
import { NextResponse } from 'next/server';


export async function POST(request:Request){
    try {
        const currentUser = await getCurrentUser();
        const body = await request.json();
        // it will handle one-to-one & one-to-many(group) conversations also
        const {userId,isGroup,members,name} = body;

        // check the currentUser exist or not
        if(!currentUser?.id || !currentUser.email){
            return new NextResponse("Unauthorized",{status:401});
        }

        // if there is group but not enough member to do group chat or there is no name of group
        if(isGroup && (!members || members.length < 2  || name)){
            return new NextResponse("Invalid data",{status:400});
        }

        // handling group chat conversation
        if(isGroup) {
            const newConversation = await prisma.conversation.create({
                data:{
                    name,
                    isGroup,
                    users:{
                        connect:[
                            // the member ids for group
                            ...members.map((member:{value:string}) =>({
                                id:member.value
                            })),
                            // the currentUser who creates the group
                            {
                                id:currentUser.id
                            }
                        ]
                    }
                },
                // when we fetch the conversations, it will populate the group member data or details
                // also for displaying name and avatars
                include:{
                    users:true
                }
            });
            // now retrun the data if it was a group chat
            return NextResponse.json(newConversation);
        }

        // one-to-one conversation

        // why findMany not findUnique -> /*
        // ```````````````

        // */
        const existingConversations = await prisma.conversation.findMany({
            where:{
                // from both anything can be true, either chat starts between A -> B or B -> A
                OR:[
                    {
                        // conversation from A -> B
                        userIds:{
                            equals:[currentUser.id,userId]
                        }
                    },
                    {
                        // Or conversation from B -> A
                        userIds:{
                            equals:[userId,currentUser.id]
                        }
                    }
                ],
            }
        });

        // we will pick the first one, no matter who start the conversation first
        const singleConversation = existingConversations[0];
        // if anyone have start the conversation return 
        if(singleConversation) {
            return NextResponse.json(singleConversation);
        }

        // if the single conversation has not started between both, let's handle that situation also
        const newConversation = await prisma.conversation.create({
            data:{
                users:{
                    connect:[
                        // the currentUser id
                        {
                            id:currentUser.id
                        },
                        // with whom the currentUser want to do chat
                        {
                            id:userId
                        }
                    ]
                }
            },
            include:{
                // populate the user details also for displaying name and avatars
                users:true
            }
        });
        // return the new Conversations between both
        return NextResponse.json(newConversation);
    } catch (error: unknown) {
        console.log("error while getting conversations from conversations route ", error);
        return new NextResponse("Internal error", {status:500});
    }
}
