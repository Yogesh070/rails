import type { NextRequest } from 'next/server';
import { withAuth } from "next-auth/middleware"

export default withAuth(
    function middleware(request: NextRequest) {
        console.log(request);
    },
    {
        callbacks: {
            authorized: ({ token }) => {
                //TODO: Handle user access level check [WIP]
                console.log(token);
                return true
            },
        },
    }
)

export const config = {
    matcher: ['/projects/:path*'],
}