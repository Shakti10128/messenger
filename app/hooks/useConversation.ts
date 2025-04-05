import { useParams } from "next/navigation"
import { useMemo } from "react";

const useConversation = ()=>{
    const params = useParams();

    const conversationId = useMemo(()=>{
        // check if conversationId exist or not in params
        if(!params?.conversationId){
            return '';
        }

        return params.conversationId as string;
    },[params?.conversationId]);

    // return a boolean value via (!!conversationId)
    const isOpen = useMemo(()=> !!conversationId,[conversationId]);

    // return the object of conversationId & isOpen
    return useMemo(()=>({
        conversationId,
        isOpen
    }),[isOpen,conversationId]);
}

export default useConversation;