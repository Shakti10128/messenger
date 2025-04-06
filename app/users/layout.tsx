import React from "react";
import Sidebar from "../components/sidebar/Sidebar";
import getUsers from "../actions/getUsers";
import UserList from "./components/UserList";

// why async: coz we will nedd to fetch user details from database
export default async function UsersLayout({children}:{children:React.ReactNode}){
    const users = await getUsers();
    return(
        <Sidebar>
            <div className="h-full">
                <UserList items={users}/>
                {children}
            </div>
        </Sidebar>
    )
}