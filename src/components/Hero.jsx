function Navbar({ theme, setTheme }) {
  return (
    <header className="navbar">

      {/* LOGO */}
      <a href="#home" className="brand">
        <div className="brand-mark">
          A
        </div>

        <div className="brand-text">
          <strong>AGENTBLAZER</strong>
          <span>COLLECTIVE</span>
        </div>
      </a>


      {/* NAVIGATION */}
      <nav className="nav-links">
        <a href="#home">Home</a>
        <a href="#about">About Us</a>
        <a href="#events">Events & Workshops</a>
        <a href="#join">Join & Connect</a>
      </nav>


      {/* RIGHT CONTROLS */}
      <div className="nav-controls">

        <div className="theme-switcher">

          <button
            className={theme === "violet" ? "theme active" : "theme"}
            onClick={() => setTheme("violet")}
            title="Violet theme"
          >
            ⚡
          </button>

          <button
            className={theme === "inferno" ? "theme active" : "theme"}
            onClick={() => setTheme("inferno")}
            title="Inferno theme"
          >
            🔥
          </button>

          <button
            className={theme === "frost" ? "theme active" : "theme"}
            onClick={() => setTheme("frost")}
            title="Frost theme"
          >
            ❄
          </button>

        </div>

        <button className="menu-button">
          ☰
        </button>

      </div>

    </header>
  );
}

export default Navbar;