import Head from "next/head";
import Link from "next/link";

import Layout from "../../components/layout";
import { SITE_NAME } from "../index";

import { getAllPostIds, getPost } from '../../lib/posts';
import { getTranslation } from "../../lib/translations";

import useUser from "../../lib/useUser";


export async function getStaticProps({ params }) {
    const post = await getPost(params.id);
    return {
        props: {
            post,
        },
    };
}

export async function getStaticPaths() {
    const paths = await getAllPostIds();
    return {
        paths,
        fallback: false,
    };
}


const Post = ({ post }) => {

    // Use Unicode isolatation character to display text with mixed directionality properly
    // FIXME: The characters appear literally in the Windows taskbar
    const title = `\u{2068}${post.title} - ${SITE_NAME}\u{2069}`;

    const { user } = useUser();

    return (
        <Layout>
            <Head>
                <title>{title}</title>
            </Head>
            <div className="post">
                <header className="post-header">
                    <div className="title-container">
                        {
                            (() => {
                                if (post.categories && post.categories.includes("books")) {
                                    return <h1>كتاب: {post.title}</h1>
                                } else {
                                    return <h1>{post.title}</h1>
                                }
                            })()
                        }
                        {user && user.admin &&
                            <Link href={`/edit/${post.id}`}>
                                <a>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil" viewBox="0 0 16 16">
                                        <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z" />
                                    </svg>
                                </a>
                            </Link>
                        }
                    </div>
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
                                return <a href={`/tag/${tag}`} key={tag}>{getTranslation(tag)}</a>
                            })}
                        </div>
                    </div>
                </header>
                <article>
                    {post.description &&
                        <div id="post-description">{post.description}</div>
                    }
                    {/* TODO: show TOC */}
                    <div dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
                </article>
            </div >

        </Layout >
    )
};

export default Post;
