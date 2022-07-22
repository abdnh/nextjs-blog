import Link from 'next/link';

const PostList = ({ posts }) => {
    return (
        <ul id="posts">
            {
                posts.map(post => {
                    let title = post.title;
                    if (post.categories && post.categories.includes("books")) {
                        title = `كتاب: ${title}`;
                    }
                    return (
                        <li key={post.id}><time dateTime={post.formattedDate}>{post.formattedDate}</time> » <Link
                            href={`posts/${post.id}`}>{ title }</Link></li>
                    )
                })
            }
        </ul >

    )
};


export default PostList;
