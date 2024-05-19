import SEO from "components/SEO";
import Share from "components/Share";
import FollowBox from "components/follow/FollowBox";
import AuthContext from "context/AuthContext";
import {
  arrayRemove,
  arrayUnion,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { db, storage } from "firebaseApp";
import { PostProps } from "pages/home";
import { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

interface PostBoxProps {
  post: PostProps;
}

export default function PostBox({ post }: PostBoxProps) {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const imageRef = ref(storage, post?.imageUrl);
  const location = useLocation();

  const isDetailPage = location.pathname.includes("/posts/");

  const firstHashtag = post?.hashTags?.[0] || "";
  const pageTitle = isDetailPage ? firstHashtag : "PuddyPuddy";

  const imgUrl = post?.imageUrl || "";

  const toggleLike = async () => {
    const postRef = doc(db, "posts", post.id);

    if (user?.uid && post?.likes?.includes(user?.uid)) {
      await updateDoc(postRef, {
        likes: arrayRemove(user?.uid),
        likeCount: post?.likeCount ? post?.likeCount - 1 : 0,
      });
    } else {
      await updateDoc(postRef, {
        likes: arrayUnion(user?.uid),
        likeCount: post?.likeCount ? post?.likeCount + 1 : 1,
      });
    }
  };

  const handleDelete = async () => {
    const confirm = window.confirm("해당 게시글을 삭제하겠습니까");
    if (confirm) {
      if (post?.imageUrl) {
        deleteObject(imageRef).catch((error) => {
          console.log(error);
        });
      }
      await deleteDoc(doc(db, "posts", post.id));
      alert("삭제함");
      navigate("/");
    }
  };

  return (
    <>
      {isDetailPage ? (
        <div className="post-box" key={post?.id}>
          <SEO title={pageTitle} description={pageTitle} />
          <div className="post-box-profile">
            {post?.profileUrl ? (
              <img
                src={post?.profileUrl}
                alt="profile"
                className="post-box-profile-img"
              />
            ) : (
              "작성자프로필이미지없음"
            )}
            <div className="post-email">{post?.email}</div>
            <FollowBox post={post} />
          </div>
          <Link to={`/posts/${post?.id}`}>
            <div className="post-box-content">
              <div className="post-box-content-photo">
                {post?.imageUrl && <img src={post?.imageUrl} />}
              </div>
              <div className="post-box-content-text">{post?.content}</div>
            </div>
            <div className="post-box-content-hashtag">
              {post?.hashTags?.map((tag, index) => (
                <span key={index}>#{tag}</span>
              ))}
            </div>
          </Link>
          <div className="post-box-footer">
            <div className="post-box-footer-likes-comments-user-btn">
              <div className="post-box-footer-likes-comments">
                <button
                  type="button"
                  className="likes-btn"
                  onClick={toggleLike}
                >
                  {user && post?.likes?.includes(user.uid) ? (
                    <img
                      src="/images/filledheart.png"
                      alt="filledheart"
                      className="like"
                    />
                  ) : (
                    <img src="/images/heart.png" alt="heart" className="like" />
                  )}
                </button>
                <button type="button" className="comments-btn">
                  <img
                    src="/images/comment.png"
                    alt="comment"
                    className="comment"
                  />
                  <div>{post?.comments?.length || 0}</div>
                </button>
              </div>
              <div className="share-edit-delete">
                <Share title={pageTitle} imageUrl={imgUrl} />
                <div>
                  {user?.uid === post?.uid && (
                    <div className="post-box-footer-edit-delete">
                      <button type="button" className="edit-btn">
                        <Link to={`/posts/edit/${post?.id}`}>
                          <img
                            src="/images/pencil.png"
                            alt="edit"
                            className="edit"
                          />
                        </Link>
                      </button>
                      <button
                        type="button"
                        className="delete-btn"
                        onClick={handleDelete}
                      >
                        <img
                          src="/images/trash.png"
                          alt="delete"
                          className="delete"
                        />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {post?.likeCount || 0} 명이 좋아합니다
            <div className="post-createdAt">{post?.createdAt}</div>
          </div>
        </div>
      ) : (
        <div className="post-box-photo-only" key={post?.id}>
          <Link to={`/posts/${post?.id}`}>
            <div className="post-box-content">
              <div className="post-box-content-photo">
                {post?.imageUrl && <img src={post?.imageUrl} />}
              </div>
            </div>
          </Link>
          <div className="post-box-footer-likes-comments">
            <div className="btn-wrapper">
              <button type="button" className="likes-btn" onClick={toggleLike}>
                {user && post?.likes?.includes(user.uid) ? (
                  <img
                    src="/images/filledheart.png"
                    alt="filledheart"
                    className="like"
                  />
                ) : (
                  <img src="/images/heart.png" alt="heart" className="like" />
                )}
              </button>
              <button type="button" className="comments-btn">
                <img
                  src="/images/comment.png"
                  alt="comment"
                  className="comment"
                />
                <div>{post?.comments?.length || 0}</div>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
