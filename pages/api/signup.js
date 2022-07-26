import { withIronSessionApiRoute } from "iron-session/next"
import db from "../../lib/db"
import { sessionOptions } from "../../lib/session"

export default withIronSessionApiRoute(signupRoute, sessionOptions)

async function signupRoute(req, res) {
    if (req.method !== "POST") {
        res.status(405)
    }
    else {
        const { username, password } = await req.body
        try {
            const user = await db.createUser(username, password)
            req.session.user = user
            await req.session.save()
            res.status(200).json(user)
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    }
}
