import { useState } from "react";
import IntroScreen from "./components/IntroScreen";

function App() {
  const [showIntro, setShowIntro] = useState(true);

  return (
    <>
      {showIntro && (
        <IntroScreen onContinue={() => setShowIntro(false)} />
      )}

      {!showIntro && (
        <div>
          {/* We will build the actual MP4 homepage here next */}
          <h1>AgentBlazer</h1>
        </div>
      )}
    </>
  );
}

export default App;