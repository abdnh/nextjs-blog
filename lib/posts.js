import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkDirective from 'remark-directive';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import { h } from 'hastscript';
import { visit } from 'unist-util-visit'

const postsDirName = 'posts';
const postsDirectory = path.join(process.cwd(), postsDirName);

export async function getPost(ids, renderContents = true) {
    const pathComponents = Array.from(ids);
    pathComponents[pathComponents.length - 1] = pathComponents[pathComponents.length - 1] + ".md";
    const fullPath = path.join(postsDirectory, ...pathComponents);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const fileStats = fs.statSync(fullPath);
    const parsed = matter(fileContents);
    parsed.data.lastModified = fileStats.mtime.toISOString().split('T')[0];
    if (!parsed.data.tags) {
        parsed.data.tags = [];
    }
    // Categories are deduced from the filesystem hierarchy
    parsed.data.categories = ids.slice(1);

    let contentHtml = null;
    if (renderContents) {
        const file = await unified()
            .use(remarkParse)
            .use(remarkDirective)
            .use(remarkImagePlugin)
            .use(remarkRehype)
            .use(rehypeStringify)
            .process(parsed.content)
        contentHtml = file.toString();
        // const processedContent = await remark()
        //     .use(html)
        //     .process(parsed.content);
        // contentHtml = processedContent.toString();
    }

    return {
        id: ids.join("/"),
        contentHtml,
        ...parsed.data,
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
    const idLists = getIdLists();
    const promises = idLists.map(idList => {
        return getPost(idList, false);
    });
    let allPosts = await Promise.all(promises);
    allPosts = allPosts.filter(({ date }) => date);
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

function walkDir(dirName, parents = []) {
    parents = Array.from(parents);
    const fullPath = path.resolve(postsDirName, ...parents, dirName);
    const childEntries = fs.readdirSync(fullPath, { withFileTypes: true });
    let ret = [];
    if (dirName) {
        parents.push(dirName);
    }
    for (const childEntry of childEntries) {
        if (!childEntry.isDirectory()) {
            ret.push([...parents, childEntry.name]);
        }
        else {
            ret.push(...walkDir(childEntry.name, parents));
        }
    }
    return ret;
}

function getIdLists() {
    const idLists = walkDir("");
    for (const idList of idLists) {
        idList[idList.length - 1] = idList[idList.length - 1].replace(/\.md$/, '');
    }
    return idLists;
}

export function getAllPostIds() {
    return getIdLists().map(idList => {
        return {
            params: {
                id: idList,
            },
        };

    })
}
