import React from "react";
import Footer from "./Footer";
import Navbar from "./Navbar";

const Layout = ({ children }) => (
  <>
    <Navbar />          {/* <-- Navbar at top */}
    <main>{children}</main>
    <Footer />          {/* <-- Footer at bottom */}
  </>
);

export default Layout;
