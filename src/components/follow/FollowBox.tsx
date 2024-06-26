import AuthContext from "context/AuthContext";
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "firebaseApp";
import { PostProps } from "pages/home";
import { useCallback, useContext, useEffect, useState } from "react";

interface FollowProps {
  post: PostProps;
}

interface UserProps {
  id: string;
}

export default function FollowingBox({ post }: FollowProps) {
  const { user } = useContext(AuthContext);
  const [postFollowers, setPostFollowers] = useState<any>([]);

  const onClickFollow = async (e: any) => {
    e.preventDefault();

    try {
      if (user?.uid) {
        const followingRef = doc(db, "following", user?.uid);

        await setDoc(
          followingRef,
          {
            users: arrayUnion({ id: post?.uid }),
          },
          { merge: true }
        );

        const followerRef = doc(db, "follower", post?.uid);

        await setDoc(
          followerRef,
          {
            users: arrayUnion({ id: user?.uid }),
          },
          { merge: true }
        );

        await addDoc(collection(db, "notifications"), {
          createdAt: new Date()?.toLocaleDateString("ko", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }),
          content: `${user?.email || user?.displayName}가 팔로우 함`,
          url: "#",
          isRead: false,
          uid: post?.uid,
        });

        alert("팔로우");
      }
    } catch (e) {
      console.log(e);
    }
  };

  const onClickDeleteFollow = async (e: any) => {
    e.preventDefault();
    try {
      if (user?.uid) {
        const followingRef = doc(db, "following", user?.uid);
        await updateDoc(followingRef, {
          users: arrayRemove({ id: post?.uid }),
        });
        const followerRef = doc(db, "follower", post?.uid);
        await updateDoc(followerRef, {
          users: arrayRemove({ id: user.uid }),
        });
        alert("팔로우 취소");
      }
    } catch (e) {}
  };

  const getFollowers = useCallback(async () => {
    if (post.uid) {
      const ref = doc(db, "follower", post.uid);
      onSnapshot(ref, (doc) => {
        setPostFollowers([]);
        doc
          ?.data()
          ?.users?.map((user: UserProps) =>
            setPostFollowers((prev: UserProps[]) =>
              prev ? [...prev, user?.id] : []
            )
          );
      });
    }
  }, [post.uid]);

  useEffect(() => {
    if (post.uid) getFollowers();
  }, [getFollowers, post.uid]);

  return (
    <>
      {user?.uid !== post?.uid &&
        (postFollowers?.includes(user?.uid) ? (
          <button
            type="button"
            className="post-following-btn"
            onClick={onClickDeleteFollow}
          >
            Following
          </button>
        ) : (
          <button
            type="button"
            className="post-follow-btn"
            onClick={onClickFollow}
          >
            Follow
          </button>
        ))}
    </>
  );
}
