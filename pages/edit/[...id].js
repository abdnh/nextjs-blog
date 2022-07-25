import { useEffect, useState, useMemo } from "react";
import { Suspense } from 'react'
import Head from "next/head";
import Link from "next/link";
import dynamic from 'next/dynamic';

import Layout from "../../components/layout";
import { getAllPostIds, getPost } from '../../lib/posts';
import useUser from "../../lib/useUser";

import "easymde/dist/easymde.min.css";
import { useRouter } from "next/router";

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

export default function Edit({ post }) {
    const title = `تعديل: ${post.title}`;
    const [SimpleMdeReact, setSimpleMdeReact] = useState();
    const [updating, setUpdating] = useState(false);
    const router = useRouter();
    // FIXME: also redirect or show error if not admin
    const { user } = useUser({
        redirectTo: "/login",
    });

    useEffect(() => {
        setSimpleMdeReact(dynamic(() => import('react-simplemde-editor'), { ssr: false, suspense: true }));

    }, []);

    const [value, setValue] = useState(post.content);
    const onChange = (value) => {
        setValue(value);
    };

    const editorOptions = useMemo(() => {
        return {
            autofocus: true,
            spellChecker: false,
            direction: "rtl",
        };
    }, []);

    async function onSubmit(event) {
        setUpdating(true);
        event.preventDefault();
        post.content = value;
        const response = await fetch("/api/update_post", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ post }),
        });
        const data = await response.json();
        if (response.ok) {
            router.push(`/posts/${post.id}`);
        } else {
            //TODO
        }
        setUpdating(false);
    }

    return (
        <Layout>
            <Head>
                <title>{title}</title>
            </Head>
            <header className="post-header">
                <h1>تعديل: <Link href={`/posts/${post.id}`}><a>{post.title}</a></Link></h1>
            </header>
            <Suspense fallback="تحميل...">
                {SimpleMdeReact &&
                    <SimpleMdeReact value={value} onChange={onChange} options={editorOptions} />}
            </Suspense>

            <div className="update-controls">
                <button onClick={onSubmit} className="button">حفظ</button>
                {updating &&
                    // FIXME: make it spin
                    <div id="spinner">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-arrow-repeat" viewBox="0 0 16 16">
                            <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z" />
                            <path fill-rule="evenodd" d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z" />
                        </svg>
                    </div>
                }
            </div>

            {/* RTL styles adapted from https://github.com/imAbdelhadi/easymde-rtl */}
            <style global jsx>{
                `
                .editor-statusbar {
                    text-align: left;
                }
                .editor-preview-full {
                    direction: rtl;
                    text-align: right;
                    right: 0;
                    left: 0;
                }
                .editor-preview *{
                    clear: both !important;
                }
                pre code {
                    text-align: left !important;
                    float: left;
                    direction: ltr !important;
                    background: #eee;
                    width: 100%;
                }
                .button {
                    cursor: pointer;
                    background-color: #ffffb9;
                    color: black;
                    min-width: 100px;
                    border-radius: 10px;
                    min-height: 35px;
                    margin-bottom: 10px;
                }
                .button:hover {
                    box-shadow: 4px 4px 7px #716262;
                }
                .update-controls {
                    display: flex;
                    align-items: baseline;

                }
                #spinner {
                    display: inline-block;
                    margin-right: 5px;
                }
                `
            }
            </style>
        </Layout>
    )
}

