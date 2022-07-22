import Head from "next/head";
import Layout from "../components/layout";
import PostList from "../components/postlist";
import { getSortedPosts } from '../lib/posts';

export const SITE_NAME = "مدونة عبدو الفضولية";

export async function getStaticProps() {
  const allPosts = await getSortedPosts();
  return {
    props: {
      allPosts,
    },
  };
}

const Home = ({ allPosts }) => {
  return (
    <>
      <Layout>
        <Head>
          <title>{SITE_NAME}</title>
          {/* TODO: add feed link */}
          <link
            rel="alternate"
            type="application/atom+xml"
            href="{{ site.feed }}"
            title="Atom Feed"
          />
          <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        </Head>
        <PostList posts={allPosts} />
      </Layout>
    </>
  );
};

export default Home;
