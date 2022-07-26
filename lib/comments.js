import db from "../lib/db";
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeSanitize from 'rehype-sanitize'
import rehypeStringify from 'rehype-stringify'

async function renderComment(comment) {
    const file = await unified()
        .use(remarkParse)
        .use(remarkRehype)
        .use(rehypeSanitize)
        .use(rehypeStringify)
        .process(comment.content);
    comment.contentHtml = file.toString();
    return comment;
}

export async function getPostComments(post) {
    const comments = await db.getComments();
    return await Promise.all(comments.filter(comment => comment.postID === post.id).map(comment => renderComment(comment)));
}
