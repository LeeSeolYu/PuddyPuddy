import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { app } from "firebaseApp";

export default function LoginForm() {
  const [error, setError] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  const onSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const auth = getAuth(app);
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
      alert("성공적으로 로그인 됨");
    } catch (error: any) {
      alert(error?.code);
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = e;

    if (name === "email") {
      setEmail(value);
      const validRegex =
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

      if (!value?.match(validRegex)) {
        setError("이메일 형식이 올바르지 않습니다");
      } else {
        setError("");
      }
    }

    if (name === "password") {
      setPassword(value);

      if (value?.length < 8) {
        setError("비밀번호는 8자리 이상 입력");
      } else {
        setError("");
      }
    }
  };

  return (
    <form className="login-form" onSubmit={onSubmit}>
      <div>
        <img
          src="/images/puddypuddy_logo.png"
          alt="Logo"
          className="login-logo"
        />
      </div>
      <input
        type="text"
        name="email"
        id="email"
        value={email}
        required
        onChange={onChange}
        className="login-email"
        placeholder="Email"
      />
      <input
        type="password"
        name="password"
        id="password"
        value={password}
        onChange={onChange}
        required
        placeholder="Password"
      />
      <button type="submit" disabled={error?.length > 0}>
        Log in
      </button>
      <div className="error-message">
        {error && error?.length > 0 && <>{error}</>}
      </div>
      <div>
        Dont' have an account?
        <Link to="/users/signup"> Sign up</Link>
      </div>
    </form>
  );
}
