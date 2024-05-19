import { useContext, useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db, storage } from "firebaseApp";
import AuthContext from "context/AuthContext";
import { v4 as uuidv4 } from "uuid";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { useNavigate } from "react-router-dom";

export default function PostForm() {
  const [content, setContent] = useState<string>("");
  const [hashTag, setHashTag] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [imageFile, setImageFile] = useState<string | null>(null);
  const { user } = useContext(AuthContext);
  const [tags, setTags] = useState<string[]>([]);
  const navigate = useNavigate();

  const handlePhotoUpload = (e: any) => {
    const {
      target: { files },
    } = e;

    const file = files?.[0];
    const fileReader = new FileReader();
    fileReader?.readAsDataURL(file);

    fileReader.onloadend = (e: any) => {
      const { result } = e?.currentTarget;
      setImageFile(result);
    };
  };

  const onSubmit = async (e: any) => {
    setIsUploading(true);
    const key = `${user?.uid}/${uuidv4()}`;
    const storageRef = ref(storage, key);
    e.preventDefault();

    try {
      let imageUrl = "";
      if (imageFile) {
        const data = await uploadString(storageRef, imageFile, "data_url");
        imageUrl = await getDownloadURL(data?.ref);
      }
      await addDoc(collection(db, "posts"), {
        content: content,
        createdAt: new Date()?.toLocaleDateString("ko", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
        uid: user?.uid,
        email: user?.email,
        hashTags: tags,
        imageUrl: imageUrl,
      });
      setTags([]);
      setHashTag("");
      setContent("");
      navigate(`/profile`);
      alert("게시글 작성");
      setImageFile(null);
      setIsUploading(false);
    } catch (e: any) {}
  };

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const {
      target: { name, value },
    } = e;

    if (name === "content") {
      setContent(value);
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags?.filter((val) => val !== tag));
  };

  const onChangeHashTag = (e: any) => {
    setHashTag(e?.target?.value?.trim());
  };

  const handleKeyUp = (e: any) => {
    if (e.keyCode === 32 && e.target.value.trim() !== "") {
      if (tags?.includes(e.target.value?.trim())) {
        alert("같은 해시태그가 이미 있음");
      } else {
        setTags((prev) => (prev?.length > 0 ? [...prev, hashTag] : [hashTag]));
        setHashTag("");
      }
    }
  };

  const handleDeleteImage = () => {
    setImageFile(null);
  };

  return (
    <form action="" className="post-form" onSubmit={onSubmit}>
      <div className="post-form-photo">
        {!imageFile && (
          <label htmlFor="file-input">
            <img
              src="/images/camera.svg"
              alt="사진 업로드"
              className="post-form-photo-btn"
            />
          </label>
        )}
        <input
          type="file"
          name="file-input"
          id="file-input"
          accept="image/*"
          onChange={handlePhotoUpload}
          className="hidden"
        />
        {imageFile && (
          <div className="post-form-photoImg-wrapper">
            <img src={imageFile} className="post-form-photoImg" />
            <button onClick={handleDeleteImage}>사진 삭제</button>
          </div>
        )}
      </div>
      <textarea
        className="post-form-textarea"
        required
        name="content"
        id="content"
        placeholder="여기에 내용을 적으세요"
        onChange={onChange}
        value={content}
      />
      <div className="post-form-hashtag">
        <span className="post-form-hashtag-label">해시태그</span>
        {tags?.map((tag, index) => (
          <span key={index} onClick={() => removeTag(tag)}>
            #{tag}
          </span>
        ))}
        <input
          name="hashtag"
          id="hashtag"
          placeholder="해시태그 + 스페이스바 입력"
          onChange={onChangeHashTag}
          onKeyUp={handleKeyUp}
          value={hashTag}
        />
      </div>
      <div className="post-form-submit-area">
        <button type="submit" className="post-form-btn" disabled={isUploading}>
          <img src="/images/button.png" alt="Post 작성" />
        </button>
      </div>
    </form>
  );
}
