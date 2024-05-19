import { useCallback, useContext, useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, storage } from "firebaseApp";
import { useNavigate, useParams } from "react-router-dom";
import { PostProps } from "pages/home";
import AuthContext from "context/AuthContext";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadString,
} from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

export default function PostEditForm() {
  const params = useParams();
  const [post, setPost] = useState<PostProps | null>(null);
  const [content, setContent] = useState<string>("");
  const [hashTag, setHashTag] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [imageFile, setImageFile] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

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

  const getPost = useCallback(async () => {
    if (params.id) {
      const docRef = doc(db, "posts", params.id);
      const docSnap = await getDoc(docRef);
      setPost({ ...(docSnap?.data() as PostProps), id: docSnap.id });
      setContent(docSnap?.data()?.content);
      setTags(docSnap?.data()?.hashTags);
      setImageFile(docSnap?.data()?.imageUrl);
    }
  }, [params.id]);

  const onSubmit = async (e: any) => {
    setIsUploading(true);
    const key = `${user?.uid}/${uuidv4()}`;
    const storageRef = ref(storage, key);
    e.preventDefault();

    try {
      if (post) {
        if (post?.imageUrl) {
          let imageRef = ref(storage, post?.imageUrl);
          await deleteObject(imageRef).catch((error) => {
            console.log(error);
          });
        }

        let imageUrl = "";
        if (imageFile) {
          const data = await uploadString(storageRef, imageFile, "data_url");
          imageUrl = await getDownloadURL(data?.ref);
        }
        const postRef = doc(db, "posts", post?.id);
        await updateDoc(postRef, {
          content: content,
          hashTags: tags,
          imageUrl: imageUrl,
        });
        navigate(`/posts/${post?.id}`);
        alert("게시글 수정");
      }
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

  useEffect(() => {
    if (params.id) getPost();
  }, [getPost, params.id]);

  return (
    <>
      <button className="back-btn" type="button" onClick={() => navigate(-1)}>
        <img src="/images/back.png" alt="back" className="back" />
      </button>

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
          <button
            type="submit"
            className="post-form-btn"
            disabled={isUploading}
          >
            <img src="/images/button.png" alt="Post 수정" />
          </button>
        </div>
      </form>
    </>
  );
}
