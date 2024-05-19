import { doc, getDoc, onSnapshot } from "firebase/firestore";

import PostBox from "components/posts/PostBox";
import { PostProps } from "pages/home";
import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "firebaseApp";
import CommentForm from "components/comments/CommentForm";
import CommentBox, { CommentProps } from "components/comments/CommentBox";
import Loading from "components/loading/Loading";

export default function PostDetail() {
  const params = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<PostProps | null>(null);

  const getPost = useCallback(async () => {
    if (params.id) {
      const docRef = doc(db, "posts", params.id);
      onSnapshot(docRef, (doc) => {
        setPost({ ...(doc?.data() as PostProps), id: doc.id });
      });
    }
  }, [params.id]);

  useEffect(() => {
    if (params.id) getPost();
  }, [getPost, params.id]);

  return (
    <div className="post-detail-wrapper">
      <button
        className="back-btn back-btn-absolute"
        type="button"
        onClick={() => navigate(-1)}
      >
        <img src="/images/back.png" alt="back" className="back" />
      </button>
      <div className="post-detail">
        {post ? (
          <div className="post-comment">
            <PostBox post={post} />
            <CommentForm post={post} />
            <div className="comment-boxs">
              {post?.comments
                ?.slice(0)
                ?.reverse()
                ?.map((data: CommentProps, index: number) => (
                  <CommentBox data={data} key={index} post={post} />
                ))}
            </div>
          </div>
        ) : (
          <Loading />
        )}
      </div>
    </div>
  );
}
