import { useParams } from "react-router-dom";
import VideoCall from "./videoCall";

export default function VideoCallWrapper() {
  const { chatSessionId, userId } = useParams();
  //   const userId = "currentUserId"; // replace with logged-in user
  return <VideoCall chatSessionId={chatSessionId} userId={userId} />;
}
