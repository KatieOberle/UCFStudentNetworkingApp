
interface CheckEmailPageProps {
  onLoginClick: () => void;
}

function CheckEmailPage({ onLoginClick }: CheckEmailPageProps) {
  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Check Your Email</h1>
        <h2>One more step to join KnightLink!</h2>

        <p>
          Please check your UCF email for a verification link.
          You must verify your email address before you can log in.
        </p>

        <div className="verification-message">
          <p>
            Didn't receive an email? Check your spam or junk folder.
          </p>
        </div>

        <button
          type="button"
          className="primary-button"
          onClick={onLoginClick}
        >
          Back to Login
        </button>
      </div>
    </div>
  );
}

export default CheckEmailPage;

