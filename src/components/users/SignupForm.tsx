import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { app } from "firebaseApp";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function SignupForm() {
  const [error, setError] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>("");
  const navigate = useNavigate();

  const onSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const auth = getAuth(app);
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/");
      alert("성공적으로 회원가입 됨");
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
      } else if (value !== passwordConfirmation) {
        setError("비밀번호와 비밀번호 확인 값 다름");
      } else {
        setError("");
      }
    }

    if (name === "password_confirmation") {
      setPasswordConfirmation(value);

      if (value?.length < 8) {
        setError("비밀번호는 8자리 이상 입력");
      } else if (value !== password) {
        setError("비밀번호와 비밀번호 확인 값 다름");
      } else {
        setError("");
      }
    }
  };

  return (
    <form className="signup-form" onSubmit={onSubmit}>
      <div>
        <img
          src="/images/puddypuddy_logo.png"
          alt="Logo"
          className="signup-logo"
        />
      </div>
      <input
        type="text"
        name="email"
        id="email"
        value={email}
        required
        onChange={onChange}
        className="signup-email"
        placeholder="Email"
      />
      <input
        type="password"
        name="password"
        id="email"
        value={password}
        required
        onChange={onChange}
        placeholder="Password"
      />
      <input
        type="password"
        name="password_confirmation"
        value={passwordConfirmation}
        id="email"
        required
        onChange={onChange}
        placeholder="Password"
      />
      <button type="submit" disabled={error?.length > 0}>
        Sign up
      </button>
      <div className="error-message">
        {error && error?.length > 0 && <>{error}</>}
      </div>
      <div>
        Have an account?
        <Link to="/users/login"> Log in</Link>
      </div>
    </form>
  );
}
