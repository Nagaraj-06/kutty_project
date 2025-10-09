import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import VideoCall from "./videoCall";
import { useParams } from "react-router-dom";
import VideoCallWrapper from "./VideoCallWrapper";
import Sample from "./Sample";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/video/:chatSessionId/:userId" element={<VideoCallWrapper />} />
        <Route path="/sample" element={<Sample />} />
      </Routes>
    </Router>
  );
}

export default App;
