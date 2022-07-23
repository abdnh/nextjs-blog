import Head from "next/head";

import Layout from "../../components/layout";
import { SITE_NAME } from "../index";

import { getAllPostIds, getPost } from '../../lib/posts';

export async function getStaticProps({ params }) {
    const post = await getPost(params.id);
    return {
        props: {
            post,
        },
    };
}

export async function getStaticPaths() {
    const paths = getAllPostIds();
    return {
        paths,
        fallback: false,
    };
}


const Post = ({ post }) => {

    // Use Unicode isolatation character to display text with mixed directionality properly
    // FIXME: The characters appear literally in the Windows taskbar
    const title = `\u{2068}${post.title} - ${SITE_NAME}\u{2069}`;

    return (
        <Layout>
            <Head>
                <title>{title}</title>
            </Head>
            <div className="post">
                <header className="post-header">
                    {
                        (() => {
                            if (post.categories && post.categories.includes("books")) {
                                return <h1>كتاب: {post.title}</h1>
                            } else {
                                return <h1>{post.title}</h1>
                            }
                        })()
                    }
                    <div>
                        <div>
                            <time dateTime={post.date} title="تاريخ الإنشاء">{post.date}</time>
                            |
                            {post.lastModified != post.date &&
                                <a href={`https://github.com/abdnh/nextjs-blog/commits/master/posts/${post.id}.md`}><time dateTime={post.lastModified} title="آخر تعديل">{post.lastModified}</time></a>
                            }
                        </div>
                        <div id="tags">
                            {post.tags.map(tag => {
                                // TODO: show translated tags
                                <a href="/tag/{{ tag }}">{tag}</a>
                            })}
                        </div>
                    </div>
                </header >
                <article>
                    {post.description &&
                        <div id="post-description">{post.description}</div>
                    }
                    {/* TODO: show TOC */}
                    <div dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
                    {post.content}
                </article>
            </div >

        </Layout >
    )
};

export default Post;
