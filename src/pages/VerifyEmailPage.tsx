import { useEffect, useState } from "react";
import { verifyEmail } from "../services/api";

export default function VerifyEmailPage({onLoginClick}: {onLoginClick: () => void}) {
  const [message, setMessage] = useState("Verifying your email...");
  const [error, setError] = useState(false);
  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token");
    if (!token) {
      setError(true);
      setMessage("Missing verification token. Please use the link from your email.");
      return;
    }
    let cancelled = false;
    verifyEmail(token).then((data) => {
      if (!cancelled) { setMessage(data.message); setError(false); }
    }).catch((err: unknown) => {
      if (!cancelled) {
        setError(true);
        setMessage(err instanceof Error ? err.message : "Verification failed.");
      }
    });
    return () => { cancelled = true; };
  }, []);
  return <div className="login-page"><div className="login-card">
    <h1>Verify Email</h1><h2>KnightLink account verification</h2>
    <p role={error ? "alert" : "status"} className={error ? "form-error" : undefined}>{message}</p>
    <button type="button" onClick={onLoginClick}>Back to Login</button>
  </div></div>;
}
