import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkDirective from 'remark-directive';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import { h } from 'hastscript';
import { visit } from 'unist-util-visit';

import db from "../lib/db";

async function getPosts() {
    return (await db.getPosts()).map(post => {
        const idComponents = post.id.split("/");
        post.categories = idComponents.slice(0, idComponents.length - 1);
        post.tags = (post.tags ? post.tags : []);
        return post;
    })
}

function arraysAreEqual(arr1, arr2) {
    return arr1.every((e, i) => e === arr2[i]);
}

export async function getPost(ids) {
    const allPosts = await getPosts();
    const post = allPosts.find(post => arraysAreEqual(post.id.split("/"), ids));
    if (!post) return {};
    const file = await unified()
        .use(remarkParse)
        .use(remarkDirective)
        .use(remarkImagePlugin)
        .use(remarkRehype)
        .use(rehypeStringify)
        .process(post.content)

    return {
        ...post, contentHtml: file.toString(),
    };
}

function remarkImagePlugin() {
    return (tree, file) => {
        visit(tree, (node) => {

            if (
                node.type === 'textDirective' ||
                node.type === 'leafDirective' ||
                node.type === 'containerDirective'
            ) {
                if (node.name !== 'img') return

                const data = node.data || (node.data = {})
                const attributes = node.attributes || {}
                if (!attributes.src) file.fail('Missing image src', node);
                const src = `/assets/images/${attributes.src}`;
                const caption = attributes.caption ? attributes.caption : "";
                const alt = attributes.alt ? attributes.alt : caption;
                let hast;
                // if (caption) {
                //     // FIXME: this doesn't seem to work - only an empty <figure> is being inserted
                //     hast = h(
                //         "figure",
                //         h('img', { src, alt }),
                //         h('figcaption', caption),
                //     )
                // } else {
                hast = h("img", { src, alt })
                // }
                data.hName = hast.tagName;
                data.hProperties = hast.properties;
            }
        })
    }
}

/* Credit: https://nextjs.org/learn/basics/data-fetching/implement-getstaticprops */
export async function getSortedPosts() {
    let allPosts = await getPosts();
    allPosts = allPosts.filter(({ date }) => date);
    // console.log(JSON.stringify(allPosts));
    return allPosts.sort(({ date: a }, { date: b }) => {
        if (a < b) {
            return 1;
        } else if (a > b) {
            return -1;
        } else {
            return 0;
        }
    });
}

async function getIdLists() {
    const idLists = (await getPosts()).map(post => post.id.split("/"));
    return idLists;
}

export async function getAllPostIds() {
    return (await getIdLists()).map(idList => {
        return {
            params: {
                id: idList,
            },
        };

    })
}


export async function updatePost(post) {
    return await db.updatePost(post);
}
