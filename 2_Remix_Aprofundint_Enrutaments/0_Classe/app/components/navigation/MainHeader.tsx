import React from "react";
import Logo from "../util/Logo";

const MainHeader: React.FC = () => {
  return (
    <header id="main-header">
      <Logo />
      <nav id="main-nav">
        <ul>
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a href="/pricing">Pricing</a>
          </li>
          <li>
            <a href="/expenses">Expenses</a>
          </li>
        </ul>
      </nav>
      <nav id="cta-nav">
        <ul>
          <li>
            <a href="/auth" className="cta">
              Login
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default MainHeader;
