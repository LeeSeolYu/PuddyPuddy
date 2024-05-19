import AuthContext from "context/AuthContext";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "firebaseApp";
import { PostProps } from "pages/home";
import { useContext, useState } from "react";

export interface CommentFormProps {
  post: PostProps | null;
}

export default function CommentForm({ post }: CommentFormProps) {
  const [comment, setComment] = useState<string>("");
  const { user } = useContext(AuthContext);

  const truncate = (str: string) => {
    return str?.length > 10 ? str?.substring(0, 10) + "..." : str;
  };

  const onSubmit = async (e: any) => {
    e.preventDefault();

    if (post && user) {
      const postRef = doc(db, "posts", post?.id);

      const commentObj = {
        comment: comment,
        uid: user?.uid,
        email: user?.uid,
        createdAt: new Date()?.toLocaleDateString("ko", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      };

      await updateDoc(postRef, {
        comments: arrayUnion(commentObj),
      });

      if (user?.uid !== post?.uid) {
        await addDoc(collection(db, "notifications"), {
          createdAt: new Date()?.toLocaleDateString("ko", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }),

          uid: post?.uid,
          isRead: false,
          url: `/posts/${post?.id}`,
          content: `${truncate(post?.content)} 글에 댓글이 작성됨`,
        });
      }

      alert("댓글 성공");
      setComment("");

      try {
      } catch (e: any) {}
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const {
      target: { name, value },
    } = e;

    if (name === "comment") setComment(value);
  };

  return (
    <form className="comment-form" onSubmit={onSubmit}>
      <textarea
        className="comment-form-textarea"
        name="comment"
        id="comment"
        required
        placeholder="댓글 입력"
        onChange={onChange}
        value={comment}
      />
      <div className="comment-form-submit-area">
        <button type="submit" className="comment-form-btn" disabled={!comment}>
          <img src="/images/button.png" alt="Post 작성" />
        </button>
      </div>
    </form>
  );
}
