import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import VideoCall from "./videoCall";
import { useParams } from "react-router-dom";
import VideoCallWrapper from "./VideoCallWrapper";
import Sample from "./Sample";

// function VideoCallWrapper() {
//   const { chatSessionId } = useParams();
//   const userId = "currentUserId"; // Replace with actual logged-in user
//   return <VideoCall chatSessionId={chatSessionId} userId={userId} />;
// }

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/video/:chatSessionId" element={<VideoCallWrapper />} />
        <Route path="/sample" element={<Sample />} />
      </Routes>
    </Router>
  );
}

export default App;
