import { useState } from "react";
import "./IntroScreen.css";

function IntroScreen({ onContinue }) {
  const [leaving, setLeaving] = useState(false);

  const handleContinue = () => {
    setLeaving(true);

    setTimeout(() => {
      onContinue();
    }, 700);
  };

  return (
    <div className={`intro-screen ${leaving ? "intro-leaving" : ""}`}>
      <div className="intro-art">
        <img
          src="/intro-eyes.jpg"
          alt="AgentBlazer"
          className="intro-eyes"
        />

        <button className="tap-button" onClick={handleContinue}>
          TAP TO CONTINUE
        </button>
      </div>
    </div>
  );
}

export default IntroScreen;