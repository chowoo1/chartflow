import React from "react";
import { Link } from "react-router-dom";

export default function Navbar({ isLoggedIn, isDarkMode, onToggleDarkMode }) {
  return (
    <nav className="bg-newBgDark text-white px-6 py-3 flex justify-between items-center">
      {/* 왼쪽메뉴 시작 */}
      <div className="flex space-x-6">
        {/* 차트분석 탭 */}
        <div className="relative group">
          <button className="hover:text-yellow-400">차트분석</button>
          <div className="absolute hidden group-hover:block bg-newBox p-2 rounded shadow-lg z-10">
            <Link to="/chart/analysis" className="block px-4 py-2 hover:bg-gray-700 whitespace-nowrap">차트 분석</Link>
            <Link to="/chart/patterninform" className="block px-4 py-2 hover:bg-gray-700 whitespace-nowrap">패턴 정보</Link>
          </div>
        </div>

        {/* 모의투자 탭 */}
        <div className="relative group">
          <button className="hover:text-yellow-400">모의투자</button>
          <div className="absolute hidden group-hover:block bg-newBox p-2 rounded shadow-lg z-10">
            <Link to="/mockinvest/spot" className="block px-4 py-2 hover:bg-gray-700 whitespace-nowrap">현물</Link>
            <Link to="/mockinvest/futures" className="block px-4 py-2 hover:bg-gray-700 whitespace-nowrap">선물</Link>
            <Link to="/mockinvest/options" className="block px-4 py-2 hover:bg-gray-700 whitespace-nowrap">옵션</Link>
          </div>
        </div>
      </div>

      {/* 오른쪽메뉴 시작 로그인/마이페이지, 다크모드 버튼 */}
      <div className="flex items-center space-x-4">
        {isLoggedIn ? ( //로그인하면..
          <button className="hover:text-yellow-400">마이페이지</button>
        ) : (
          <button className="hover:text-yellow-400">로그인</button>
        )}
        <button onClick={onToggleDarkMode} className="hover:text-yellow-400">
          {isDarkMode ? "☀️" : "🌙"}
        </button>
      </div>
    </nav>
  );
}