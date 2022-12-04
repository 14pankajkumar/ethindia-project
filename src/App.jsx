import logo from "./logo.svg";
import "./App.css";
import Login from "./components/Login";
import Header from "./components/Header";
import Home from "./components/Home";
import { useAccount } from "wagmi";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Assets from "./components/Assets";
import Video from "./components/Video";
import {
  LivepeerConfig,
  createReactClient,
  studioProvider,
} from "@livepeer/react";

function App() {
  const { isDisconnected } = useAccount();
  const client = createReactClient({
    provider: studioProvider({
      apiKey: "1d0c14d4-0c5d-447a-a503-320167c77592",
    }),
  });

  if (isDisconnected) {
    return <Login />;
  }

  return (
    <LivepeerConfig client={client}>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/myassets" element={<Assets />} />
          {/* <Route path="/videominting" element={<Video />} /> */}
        </Routes>
      </BrowserRouter>
    </LivepeerConfig>
  );
}

export default App;
