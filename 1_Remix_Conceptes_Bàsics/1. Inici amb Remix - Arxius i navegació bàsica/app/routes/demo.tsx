import { Link } from "@remix-run/react";

export default function Demo() {
  return (
    <div>
      <h1>Welcome to the Demo Page</h1>
      <p>This is a basic demo page using Remix.</p>
      <div>
        <a href="/">Go back to Home</a>
      </div>

      <Link to="/">Go back to Home</Link>
    </div>
  );
}
