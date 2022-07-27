import { useState } from "react";
import Editor from "./editor";
import useUser from "../lib/useUser";

export default function CommentsSection({ post, comments, onPostedComment }) {

    const { user } = useUser();
    const [newCommentText, setNewCommentText] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    async function sumbitCommit() {
        const body = {
            date: new Date(),
            postID: post.id,
            username: user.username,
            content: newCommentText,
        }
        const response = await fetch("/api/post_comment", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
        const data = await response.json();
        if (response.ok) {
            onPostedComment(data);
            //TODO: clear editor and notify user that the comment was posted successfully
        }
        else {
            setErrorMessage("فشل نشر تعليقك");
        }
    }

    return (
        <div id="comments-section">
            <h2>تعليقات</h2>
            {user && <div id="new-comment-section">
                <Editor value={newCommentText} onChange={(v) => setNewCommentText(v)} options={{ maxHeight: '100px' }}></Editor>
                <button className="button" onClick={sumbitCommit}>تعليق</button>
                {errorMessage && <p className="error">{errorMessage}</p>}
            </div>}
            {
                comments.map(comment => {
                    return (
                        <div className="comment" key={comment.date}>
                            {/* TODO: improve display and format date */}
                            <div>&#8295;{comment.username}&#8297; | {comment.date.split('T')[0]}</div>
                            <div style={{ marginTop: "5px", marginBottom: "15px" }} dangerouslySetInnerHTML={{ __html: comment.contentHtml }}></div>
                        </div>
                    )
                })
            }
        </div>
    )
}
