import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "../../lib/session"
import db from "../../lib/db"


export default withIronSessionApiRoute(postCommentRoute, sessionOptions)

async function postCommentRoute(req, res) {
    if (!req.session.user || !req.session.user.admin) {
        res.status(403).send(null);
    }
    else {
        const { date, postID, username, content } = await req.body;
        // FIXME: sanitize comment
        const comment = await db.createComment(date, postID, username, content);
        res.status(200).send(comment);
    }
}
