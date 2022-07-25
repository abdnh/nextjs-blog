import { updatePost } from '../../lib/posts';

import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from "../../lib/session"

export default withIronSessionApiRoute(updatePostRoute, sessionOptions);

async function updatePostRoute(req, res) {
    if (!req.session.user || !req.session.user.admin) {
        res.status(403).send({ ok: false });
    }
    else {
        const { post } = await req.body;
        await updatePost(post);
        res.status(200).send({ ok: true });
    }
}
