import Head from "next/head";

import Layout from "../components/layout";
import PostList from "../components/postlist";

import { getAllCategories, getCategoryPosts } from '../lib/posts';
import { getTranslation } from "../lib/translations";

export async function getStaticProps({ params }) {
    const posts = await getCategoryPosts(params.category);
    return {
        props: {
            category: params.category,
            posts,
        },
    };
}

export async function getStaticPaths() {
    const paths = await getAllCategories();
    return {
        paths,
        fallback: false,
    };
}

export default function Category({ category, posts }) {

    const title = `تصنيف: ${getTranslation(category)}`;
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
