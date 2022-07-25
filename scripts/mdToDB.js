// Takes a directory containing Markdown posts and output them as a JSON list to stdout

const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

const postsDir = process.argv[2];
if (!postsDir) {
    throw Error("Usage: node mdToDB.js [posts_dir]")
}

function walkDir(dirName, parents = []) {
    parents = Array.from(parents);
    const fullPath = path.resolve(path.basename(postsDir), ...parents, dirName);
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

const posts = [];
for (const idList of walkDir("")) {
    const filePath = path.join(postsDir, ...idList);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const fileStats = fs.statSync(filePath);
    const parsed = matter(fileContents);
    parsed.data.lastModified = fileStats.mtime.toISOString().split('T')[0];
    if (!parsed.data.tags) {
        parsed.data.tags = [];
    }

    idList[idList.length - 1] = idList[idList.length - 1].replace(/\.md$/, "");
    parsed.data.id = idList.join("/");

    posts.push({
        ...parsed.data, content: parsed.content
    })
}
console.log(JSON.stringify(posts));
