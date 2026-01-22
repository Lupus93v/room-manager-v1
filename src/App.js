import React from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import PageLayout from "../src/components/PageLayout";
import HomePage from "./Pages/HomePage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PageLayout/>}>
          <Route index element={<HomePage/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  )}
