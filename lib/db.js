import { Low, JSONFile } from 'lowdb'
import bcrypt from 'bcrypt'

class DB {
    constructor(filename) {

        if (!filename) {
            filename = "./db.json"
        }
        const adapter = new JSONFile(filename)
        this.db = new Low(adapter)
    }
    async read() {
        if (this.db.data) return;
        await this.db.read()
        this.db.data ||= { posts: [], users: [] }

    }

    // TODO: store posts in database and implement an editor
    async addPosts(posts) {
        await read()
        for (const post of posts) {
            this.db.data.posts.push(post)
        }
        await this.db.write()
    }

    async getPosts() {
        await this.read()
        return this.db.data?.posts
    }

    async updatePost(newPost) {
        await this.read();
        const postIndex = this.db.data?.posts.findIndex(post => post.id === newPost.id);
        if (postIndex === -1) return;
        const post = this.db.data.posts[postIndex];
        Object.assign(post, newPost);
        // Do not store HTML content and categories since they are redundant
        delete post.contentHtml;
        delete post.categories;
        await this.db.write();
    }

    async createAdmin(username, password) {
        await this.read()
        const existingUser = this.db.data.users.find(user => user.username === username);
        if (existingUser) {
            throw Error(`A user with the name "${username}" already exists`);
        }
        const salt = await bcrypt.genSalt()
        const hash = await bcrypt.hash(password, salt)
        const user = { username: username, password: hash, admin: true }
        this.db.data.users.push(user)
        await this.db.write()
    }

    async getUser(username, password) {
        await this.read()
        const user = this.db.data.users.find(user => user.username === username)
        if (!user) return null;
        const result = await bcrypt.compare(password, user.password)
        if (!result) return null;
        return user;
    }
}

const db = new DB();
export default db;
// db.createAdmin("admin", "admin")
