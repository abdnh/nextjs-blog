import Sidebar from "./sidebar";
import Footer from "./footer";
import Head from "next/head";

export default function Layout({ children }) {
  return (
    <>
      {/* TODO: set up KaTeX and include it conditionally in some post pages */}
      <Head>
        {/* <link rel="stylesheet" href="/css/katex.min.css" /> */}
      </Head>
      <Sidebar />
      <main>
        {children}
      </main>
      <Footer />
    </>
  );
}
