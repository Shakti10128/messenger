import {withAuth} from 'next-auth/middleware'

export default withAuth({
    pages:{
        // homePage is out auth page
        signIn:'/'
    }
})


export const config = {
    matcher:[
        "/users/:path*"
    ]
}

// it will protect all routes or users
//ex: users/shakti/messages