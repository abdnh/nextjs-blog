import Head from "next/head";

import Layout from "../../components/layout";
import PostList from "../../components/postlist";

import { getAllTags, getTagPosts } from '../../lib/posts';
import { getTranslation } from "../../lib/translations";

export async function getStaticProps({ params }) {
    const posts = await getTagPosts(params.tag);
    return {
        props: {
            tag: params.tag,
            posts,
        },
    };
}

export async function getStaticPaths() {
    const paths = await getAllTags();
    return {
        paths,
        fallback: false,
    };
}

export default function Tag({ tag, posts }) {

    const title = `وسم: ${getTranslation(tag)}`;
    return (
        <Layout>
            <Head>
                <title>{title}</title>
            </Head>
            <div className="post">
                <header className="post-header">
                    <div className="title-container">
                        <h1>{title}</h1>
                    </div>
                </header>
            </div >
            <PostList posts={posts} />

        </Layout >
    )
};
