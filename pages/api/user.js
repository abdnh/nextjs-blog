// https://github.com/vercel/next.js/tree/canary/examples/with-iron-session

import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from "../../lib/session"

export default withIronSessionApiRoute(userRoute, sessionOptions);

async function userRoute(req, res) {
    if (req.session.user) {
        res.status(200).json(req.session.user)
    } else {
        res.status(200).json(null)
    }
}
