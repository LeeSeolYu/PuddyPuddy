import { useNavigate, useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import AuthContext from "context/AuthContext";
import { getAuth, signOut } from "firebase/auth";
import { app } from "firebaseApp";
import useTranslation from "hooks/useTranslation";

export default function Header() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const translation = useTranslation();

  if (
    location.pathname === "/users/login" ||
    location.pathname === "/users/signup"
  ) {
    return null;
  }

  const handleSearch = () => {
    if (searchQuery) {
      navigate(`/search/${encodeURIComponent(searchQuery)}`);
    }
  };

  const handlePostForm = () => {
    navigate(`/posts/new`);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div className="header">
      <button type="button" onClick={() => navigate("/")}>
        <img
          className="header-logo"
          src="/images/puddypuddy_logo.png"
          alt="Logo"
        />
      </button>
      <div className="header-search-bar">
        <input
          type="text"
          placeholder="Search"
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
        />
      </div>
      <div className="header-right">
        <div onClick={() => navigate("/notifications")}>
          <div>
            <img
              className="header-right-noti-btn"
              src="/images/noti.svg"
              alt="Notifications"
            />
          </div>
        </div>
        <div>
          <button type="button" onClick={handlePostForm}>
            <img
              className="header-right-post-btn"
              src="/images/button.png"
              alt="Post"
            />
          </button>
        </div>
        <div>
          <div onClick={() => navigate("/profile")}>
            {user ? (
              <div
                className="header-right-user-info"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <img src={user?.photoURL || "/logo192.png"} alt="Profile" />
                <div>{user?.displayName}</div>
                <div className={`hover-box ${isHovered ? "show" : ""}`}>
                  <div onClick={() => navigate("/profile")}>마이페이지</div>
                  <div
                    onClick={async () => {
                      const auth = getAuth(app);
                      await signOut(auth);
                      alert("로그아웃 됨");
                      navigate("/");
                    }}
                  >
                    {translation("HEADER_LOGOUT")}
                  </div>
                </div>
              </div>
            ) : (
              <></>
            )}
          </div>
          {user === null ? (
            <button type="button" onClick={() => navigate("/users/login")}>
              Login
            </button>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
}
