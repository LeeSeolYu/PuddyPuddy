import { useEffect } from "react";

declare global {
  interface Window {
    Kakao: any;
  }
}

interface ShareProps {
  title: string;
  imageUrl: string;
}

function Share({ title, imageUrl }: ShareProps) {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://t1.kakaocdn.net/kakao_js_sdk/2.6.0/kakao.min.js";
    script.async = true;

    document.head.appendChild(script);

    script.onload = () => {
      if (!window.Kakao.isInitialized()) {
        window.Kakao.init(process.env.REACT_APP_KAKAO_APP_KEY);
      }
    };
  }, []);

  const handleShareKakao = () => {
    window.Kakao.Share.sendDefault({
      objectType: "feed",
      content: {
        title: `${title}🧸`,
        imageUrl: `${imageUrl}`,
        link: {
          mobileWebUrl: window.location.origin,
          webUrl: window.location.origin,
        },
      },
      buttons: [
        {
          title: "Puddy Puddy",
          link: {
            mobileWebUrl: window.location.origin,
            webUrl: window.location.origin,
          },
        },
      ],
    });
  };

  return (
    <div className="share" onClick={handleShareKakao}>
      <img className="share-btn" src={`/images/share.png`} alt="share" />
    </div>
  );
}

export default Share;
