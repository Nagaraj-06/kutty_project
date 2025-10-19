import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import VideoCall from "./videoCall";
import { useParams } from "react-router-dom";
import VideoCallWrapper from "./VideoCallWrapper";
import Sample from "./Sample";
import ResetPasswordPage from "./ResetPasswodPage";
import VerifyEmail from "./VerifyEmail";

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/video/:chatSessionId/:userId"
          element={<VideoCallWrapper />}
        />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route path="/sample" element={<Sample />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
      </Routes>
    </Router>
  );
}

export default App;
