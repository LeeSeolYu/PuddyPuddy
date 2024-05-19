import { languageState } from "atom";
import PostBox from "components/posts/PostBox";
import AuthContext from "context/AuthContext";
import ThemeContext from "context/ThemeContext";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "firebaseApp";
import useTranslation from "hooks/useTranslation";
import { PostProps } from "pages/home";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useRecoilState } from "recoil";
const PROFILE_DEFAULT_URL = "/logo512.png";
type TabType = "my" | "like";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<TabType>("my");
  const [posts, setPosts] = useState<PostProps[]>([]);
  const [myPosts, setMyPosts] = useState<PostProps[]>([]);
  const [likePosts, setLikePosts] = useState<PostProps[]>([]);
  const navigate = useNavigate();
  const [language, setLanguage] = useRecoilState(languageState);
  const { user } = useContext(AuthContext);
  const translation = useTranslation();
  const context = useContext(ThemeContext);

  const onClickLanguage = () => {
    setLanguage(language === "ko" ? "en" : "ko");
    localStorage.setItem("language", language === "ko" ? "en" : "ko");
  };

  useEffect(() => {
    if (user) {
      let postsRef = collection(db, "posts");
      const myPostQuery = query(
        postsRef,
        where("uid", "==", user.uid),
        orderBy("createdAt", "desc")
      );

      const likePostQuery = query(
        postsRef,
        where("likes", "array-contains", user.uid),
        orderBy("createdAt", "desc")
      );

      onSnapshot(myPostQuery, (snapShot) => {
        let dataObj = snapShot.docs.map((doc) => ({
          ...doc.data(),
          id: doc?.id,
        }));
        setMyPosts(dataObj as PostProps[]);
      });

      onSnapshot(likePostQuery, (snapShot) => {
        let dataObj = snapShot.docs.map((doc) => ({
          ...doc.data(),
          id: doc?.id,
        }));
        setLikePosts(dataObj as PostProps[]);
      });
    }
  }, [user]);

  return (
    <div className="profile">
      <div className="profile-user-info">
        <div className="profile-user-info-left">
          <div className="profile-user-info-left-detail">
            <img
              src={user?.photoURL || PROFILE_DEFAULT_URL}
              alt=""
              width={100}
              height={100}
              className="profile-user-info-photo"
            />
            <button
              className="profile-user-info-btn"
              onClick={() => navigate("/profile/edit")}
            >
              프로필 수정
            </button>
          </div>
          <div className="profile-user-info-text">
            <div>{user?.displayName || "사용자님"}</div>
            <div>{user?.email || "이메일"}</div>
          </div>
        </div>
        <div>
          <button className="profile-user-info-btn" onClick={onClickLanguage}>
            {language === "ko" ? "한국어" : "English"}
          </button>
          <div className="profile-theme">
            <img
              src={`${process.env.PUBLIC_URL}/images/${
                context.theme === "light" ? "light.png" : "dark.png"
              }`}
              alt=""
              className="profile-theme-img"
              onClick={context.toggleMode}
            />
          </div>
        </div>
      </div>
      <div className="tabs">
        <div
          className={`tab ${activeTab === "my" && "tab-active"}`}
          onClick={() => setActiveTab("my")}
        >
          {translation("TAB_MY")}
        </div>
        <div
          className={`tab ${activeTab === "like" && "tab-active"}`}
          onClick={() => setActiveTab("like")}
        >
          {translation("TAB_LIKE")}
        </div>
      </div>
      <div>
        {activeTab === "my" && (
          <div>
            {myPosts?.length > 0 ? (
              myPosts?.map((post) => <PostBox post={post} key={post.id} />)
            ) : (
              <div>게시글이 없음</div>
            )}
          </div>
        )}
        {activeTab === "like" && (
          <div>
            {likePosts?.length > 0 ? (
              likePosts?.map((post) => <PostBox post={post} key={post.id} />)
            ) : (
              <div>게시글이 없음</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
