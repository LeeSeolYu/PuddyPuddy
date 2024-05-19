import React, { useState, useEffect } from "react";

interface LoadingProps {
  text?: string;
}

const Loading: React.FC<LoadingProps> = ({ text = "로딩 중" }) => {
  const [showSpinner, setShowSpinner] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSpinner(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="loading-wrapper">
      {showSpinner && (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>{text}</p>
        </div>
      )}
    </div>
  );
};

export default Loading;
