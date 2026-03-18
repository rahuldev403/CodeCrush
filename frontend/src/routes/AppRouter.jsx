import { Navigate, Route, Routes } from "react-router-dom";
import Landing from "@/pages/Landing";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import VerifyRegistration from "@/pages/auth/VerifyRegistration";
import Onboarding from "@/pages/Onboarding";
import Feed from "@/pages/Feed";
import Requests from "@/pages/Requests";
import Matches from "@/pages/Matches";
import Chat from "@/pages/Chat";
import Profile from "@/pages/Profile";
import GitHubCallback from "@/pages/GitHubCallback";
import IssuesTogether from "@/pages/IssuesTogether";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-registration" element={<VerifyRegistration />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/feed" element={<Feed />} />
      <Route path="/requests" element={<Requests />} />
      <Route path="/matches" element={<Matches />} />
      <Route path="/issues" element={<IssuesTogether />} />
      <Route path="/chat/:matchId" element={<Chat />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/github/callback" element={<GitHubCallback />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRouter;
