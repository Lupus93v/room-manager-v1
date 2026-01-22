import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

export default function PageLayout() {
  const [totalCapacity, setTotalCapacity] = useState(0);
  const [totalUsage, setTotalUsage] = useState(0);

  const freeCapacity = totalCapacity - totalUsage;

  return (
    <div className="site-wrapper">
      <Header 
        totalCapacity={totalCapacity} 
        totalUsage={totalUsage} 
        freeCapacity={freeCapacity} 
      />
      <main style={{ marginTop: "120px" }}>
        <Outlet context={{ setTotalCapacity, setTotalUsage }} />
      </main>
      <Footer />
    </div>
  );
}
