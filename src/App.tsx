import React from "react";
import logo from "./logo.svg";
import "./App.css";
import Header from "./Components/Header";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Boards from "./Components/Boards";
import Board from "./Components/Board";
import Issues from "./Components/Issues";


function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/boards" element={<Boards />}></Route>
        <Route path="/board/:id" element={<Board />} />
        <Route path="/issues" element={<Issues />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
