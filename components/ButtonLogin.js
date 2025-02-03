import Link from "next/link";

const ButtonLogin = ({ isLoggedIn, name, extraStyle }) => {
  isLoggedIn = true;
  if (isLoggedIn) {
    return (
      <Link
        href="/dashboard"
        className={`btn btn-primary ${extraStyle ? extraStyle : ""} `}
      >
        Go to Dashboard {name}
      </Link>
    );
  }
  return <button>Login</button>;
};

export default ButtonLogin;
