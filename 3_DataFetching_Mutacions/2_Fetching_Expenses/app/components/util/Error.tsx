import { FaExclamationCircle } from "react-icons/fa";

interface ErrorProps {
  title: string;
  children: React.ReactNode;
}

function Error({ title, children }: ErrorProps) {
  return (
    <div className="error">
      <div className="icon">
        <FaExclamationCircle />
      </div>
      <h2>{title}</h2>
      {children}
    </div>
  );
}

export default Error;
