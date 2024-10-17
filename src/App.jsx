import React from "react";
import { AuthProvider } from "./context/AuthProvider";
import Navbar from "./components/Navbar";
import { BrowserRouter as Router } from "react-router-dom";


const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Navbar/>
      </Router>
    </AuthProvider>
  );
};

export default App;
