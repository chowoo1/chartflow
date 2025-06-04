import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import TradingViewWidget from "./components/TradingViewWidget";
import TradePanel from "./components/TradePanel";
import TradeTables from "./components/TradeTables";
import ChartAnalysisPage from "./pages/ChartAnalysisPage"; // 새로 추가
import MockInvestPage from "./pages/MockInvestPage";       // 새로 추가

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 실제 로그인 연동 예정

  // 다크모드 초기 설정 (localStorage 기반)
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  // 다크모드 전환 함수
  const toggleDarkMode = () => {
    const html = document.documentElement;
    html.classList.toggle("dark");
    const nowDark = html.classList.contains("dark");
    setIsDarkMode(nowDark);
    localStorage.setItem("theme", nowDark ? "dark" : "light");
  };

  return (
    <Router>
      <div className="min-h-screen bg-white text-black dark:bg-bottomBg dark:text-white overflow-x-hidden">
        <Navbar
          isLoggedIn={isLoggedIn}
          isDarkMode={isDarkMode}
          onToggleDarkMode={toggleDarkMode}
        />

        <div className="max-w-screen-xl mx-auto p-4">
          <Routes>
            {/* 모의투자 - 선물 페이지... */}
            <Route path="/mockinvest/futures" element={
              <div>
                <div className="grid grid-cols-[3fr_1fr] gap-4">
                  <div className="h-[500px] border rounded-none overflow-hidden">
                    <TradingViewWidget />
                  </div>
                  <div className="w-fit h-fit border rounded-none">
                    <TradePanel symbol="BTCUSDT" marketPrice={108790.0} /> {/* 테스트를위한 고정입력 */}
                  </div>
                </div>
                <div className="mt-2 border rounded-none">
                  <TradeTables />
                </div>
              </div>
            } />

            {/* 차트분석 페이지 */}
            <Route path="/chart/analysis" element={<ChartAnalysisPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}