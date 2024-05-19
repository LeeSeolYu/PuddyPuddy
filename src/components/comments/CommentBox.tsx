import AuthContext from "context/AuthContext";
import { arrayRemove, doc, updateDoc } from "firebase/firestore";
import { db } from "firebaseApp";
import { PostProps } from "pages/home";
import { useContext } from "react";

export interface CommentProps {
  comment: string;
  uid: string;
  email: string;
  createdAt: string;
}

interface CommentBoxProps {
  data: CommentProps;
  post: PostProps;
}

export default function CommentBox({ data, post }: CommentBoxProps) {
  const { user } = useContext(AuthContext);
  const handleDeleteComment = async () => {
    if (post) {
      try {
        const postRef = doc(db, "posts", post?.id);
        await updateDoc(postRef, {
          comments: arrayRemove(data),
        });
        alert("댓글 삭제");
      } catch (e) {
        console.log(e);
      }
    }
  };

  return (
    <div key={data?.createdAt} className="comments">
      <img className="comment-profile" src={`/logo192.png`} alt="profile" />
      <div className="comment-info">
        <div className="comment-info-text">
          <div className="comment-info-texts">
            <div className="comment-info-text-email">{data?.email}</div>
            <div className="comment-info-text-content">{data?.comment}</div>
          </div>
          <div className="comment-info-createdAt">{data?.createdAt}</div>
        </div>
        {data?.uid === user?.uid && (
          <div className="comment-info-delete" onClick={handleDeleteComment}>
            <img
              className="comment-trash"
              src={`/images/trash.png`}
              alt="profile"
            />
          </div>
        )}
      </div>
    </div>
  );
}
