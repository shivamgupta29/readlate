import React from "react";
import { Outlet } from "react-router-dom";

const App: React.FC = () => {
  return (
    <div>
      {/* A navbar could go here later */}
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default App;
