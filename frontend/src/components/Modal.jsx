//지금동작안함 오류뜸
import React from "react";

export default function Modal({ onClose, children }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white text-black p-4 rounded w-[300px] relative">
        <button onClick={onClose} className="absolute top-2 right-3 text-gray-500 hover:text-black text-lg font-bold">×</button>
        {children}
      </div>
    </div>
  );
}