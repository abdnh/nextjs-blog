import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const postsDirName = 'posts';
const postsDirectory = path.join(process.cwd(), postsDirName);

// TODO
function formatDate(date) {
    return date.toString();
}

export async function getPost(ids, renderContents = true) {
    const pathComponents = Array.from(ids);
    pathComponents[pathComponents.length - 1] = pathComponents[pathComponents.length - 1] + ".md";
    const fullPath = path.join(postsDirectory, ...pathComponents);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const parsed = matter(fileContents);
    const formattedDate = parsed.data.date ? formatDate(parsed.data.date) : "";
    const formattedLastModified = parsed.data.lastModified ? formatDate(parsed.data.lastModified) : "";
    if (!parsed.data.tags) {
        parsed.data.tags = [];
    }
    // Categories are deduced from the filesystem hierarchy
    parsed.data.categories = ids.slice(1);

    let contentHtml = null;
    if (renderContents) {
        const processedContent = await remark()
            .use(html)
            .process(parsed.content);
        contentHtml = processedContent.toString();
    }

    return {
        id: ids.join("/"),
        contentHtml,
        formattedDate,
        formattedLastModified,
        ...parsed.data,
    };

}

/* Credit: https://nextjs.org/learn/basics/data-fetching/implement-getstaticprops */
export async function getSortedPosts() {
    const idLists = getIdLists();
    const promises = idLists.map(idList => {
        return getPost(idList, false);
    });
    const allPosts = await Promise.all(promises);
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
