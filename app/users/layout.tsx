import React from "react";
import Sidebar from "../components/sidebar/Sidebar";

// why async: coz we will nedd to fetch user details from database
export default async function UsersLayout({children}:{children:React.ReactNode}){
    return(
        <Sidebar>
            <div className="h-full">
                {children}
            </div>
        </Sidebar>
    )
}