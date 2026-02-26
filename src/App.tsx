import { Routes, Route } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import SportLayout from "./layouts/SportLayout";

import Home from "./pages/Home";
import Contact from "./pages/Contact";
import SportLive from "./pages/sport/SportLive";
import SportGuide from "./pages/sport/SportGuide";

export default function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />

        {/* Dynamic Sport Routes */}
        <Route path="/:sportName" element={<SportLayout />}>
          <Route path="live" element={<SportLive />} />
          <Route path="guide" element={<SportGuide />} />
        </Route>
      </Route>
    </Routes>
  );
}
