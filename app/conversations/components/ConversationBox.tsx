'use client'

import Avatar from "@/app/components/Avatar";
import useOtherUser from "@/app/hooks/useOtherUser";
import { FullConversationType } from "@/app/types"
import clsx from "clsx";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FC, useCallback, useMemo } from "react";

interface ConversationBoxProps{
    data: FullConversationType;
    selected?:boolean
}

const ConversationBox:FC<ConversationBoxProps> = ({data,selected}) => {
    const otherUser = useOtherUser(data);
    const session = useSession();
    const router = useRouter();

    const handleClick = useCallback(()=>{
        router.push(`/conversations/${data.id}`)
    },[data.id,router]);

    // get the last message
    const lastMessage = useMemo(()=>{
        const messages = data.messages || [];
        // we need the last message
        return messages[messages.length - 1];
    },[data.messages])

    // get the logged in user email
    const userEmail = useMemo(()=>{
        return session.data?.user?.email;
    },[session.data?.user?.email]);

    const hasSeen = useMemo(()=>{
        if(!lastMessage){
            return false;
        }
        const seenArray = lastMessage.seen || [];
        if(!userEmail) {
            return false;
        }

        // there should be atlead one user in seen array which match the current logged in user email
        return seenArray.filter((user)=> user.email === userEmail).length !== 0;
    },[lastMessage,userEmail]);

    const lastMessageText = useMemo(()=>{
        // check if the last message is image
        if(lastMessage?.image){
            return "Sent an image";
        }
        // else check for text
        if(lastMessage?.body){
            return lastMessage.body
        }
        // if till now not a conversation started
        return "Start a conversation"
    },[lastMessage]);

  return (
    <div 
    onClick={handleClick}
    className={clsx(`w-full relative flex items-center space-x-3 hover:bg-neutral-100 rounded-lg transition cursor-pointer p-3`, selected ? "bg-neutral-100" : "bg-white")}>
        <Avatar user={otherUser}/>
        <div className="min-w-0 flex-1">
            <div className="focus:outline-none">
                <div className="flex justify-between items-start mb-1">
                    <p className="text-md font-medium text-gray-900">
                        {data.name || otherUser.name}
                    </p>
                    {/* last message time */}
                    {
                        lastMessage?.createdAt && (
                            <p className="text-xs text-gray-400 font-light">
                                {
                                    format(new Date(lastMessage?.createdAt),'p')
                                }
                            </p>
                        )
                    }
                </div>
                {/* last message content */}
                <p className={clsx(`truncate text-sm`, hasSeen ? "text-gray-500" : "text-black font-medium")}>
                    {lastMessageText}
                </p>
            </div>
        </div>
    </div>
  )
}

export default ConversationBox