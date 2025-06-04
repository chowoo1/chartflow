import React, { useState } from "react";
import Modal from "./Modal";
import TradeTables from "./TradeTables";

export default function TradePanel({ symbol, marketPrice, showOnlyTables = false }) {
  const [orderType, setOrderType] = useState("limit");
  const [marginMode, setMarginMode] = useState("isolated");
  const [leverage, setLeverage] = useState(10);
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState("");
  const [orderSide, setOrderSide] = useState("buy");
  const [showMarginModal, setShowMarginModal] = useState(false);
  const [showLeverageModal, setShowLeverageModal] = useState(false);

  const handleOrder = async () => {
    const payload = {
      symbol,
      side: orderSide,
      order_type: orderType,
      price: orderType === "market" ? marketPrice : parseFloat(price),
      quantity: parseFloat(quantity),
      margin_mode: marginMode,
      leverage: leverage
    };

    console.log("보내는 주문 payload:", payload); // 오류확인을 위한 추가

    try {
      const response = await fetch("http://127.0.0.1:8000/mockinvest/order/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (response.ok) {
        alert("주문 완료: " + data.message);
      } else {
        alert("주문 실패: " + JSON.stringify(data));
      }
    } catch (error) {
      console.error("서버 오류:", error);
      alert("서버 오류 발생");
    }
  };

  if (showOnlyTables) return <TradeTables />;

  return (
    <div className="p-4 border border-gray-600 rounded-none bg-layer text-white w-[300px] h-[499px] box-border">
      {/* 마진 모드 & 레버리지 설정 */}
      <div className="flex justify-between mb-4">
        <button onClick={() => setShowMarginModal(true)} className="underline">{marginMode}</button>
        <button onClick={() => setShowLeverageModal(true)} className="underline">{leverage.toFixed(2)}x</button>
      </div>

      {/* 주문 유형 선택 탭 */}
      <div className="flex justify-start gap-6 text-sm border-b border-gray-600 mb-4">
        <button onClick={() => setOrderType("limit")} className={`pb-2 font-semibold ${orderType === "limit" ? "border-b-2 border-yellow-400 text-white" : "text-gray-400"}`}>지정가</button>
        <button onClick={() => setOrderType("market")} className={`pb-2 font-semibold ${orderType === "market" ? "border-b-2 border-yellow-400 text-white" : "text-gray-400"}`}>시장가</button>
      </div>

      {/* 주문 가격 */}
      <div className="mb-4">
        <label htmlFor="priceInput" className="block text-sm text-gray-300 mb-1">주문 가격</label>
        {orderType === "limit" ? (
          <input id="priceInput" className="w-full p-1 bg-newBox text-white border border-gray-500 rounded" placeholder="주문가격" value={price} onChange={(e) => setPrice(e.target.value)} />
        ) : (
          <input id="priceInput" className="w-full p-1 bg-newBox text-gray-400 border border-gray-500 rounded" value="시장가 자동입력" readOnly />
        )}
      </div>

      {/* 수량 */}
      <div className="mb-4">
        <label htmlFor="quantityInput" className="block text-sm text-gray-300 mb-1">수량</label>
        <input id="quantityInput" className="w-full p-1 bg-newBox text-white border border-gray-600 rounded" placeholder="주문수량" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
      </div>

      {/* 매수 / 매도 버튼 */}
      <div className="grid grid-cols-2 gap-2 mb-20">
        <button onClick={() => { setOrderSide("buy"); handleOrder(); }} className="bg-long text-white py-1 rounded">Open Long</button>
        <button onClick={() => { setOrderSide("sell"); handleOrder(); }} className="bg-short text-white py-1 rounded">Open Short</button>
      </div>

      {/* 평가 정보 (임시) */}
      <div className="text-sm text-gray-300">
        <div>평가: 100,000.0000</div>
        <div>보유: 100,000.0000</div>
        <div>가능: 100,000.0000</div>
      </div>

      {/* 마진 모드 설정 모달 */}
      {showMarginModal && (
        <Modal onClose={() => setShowMarginModal(false)}>
          <div className="p-4">
            <h2 className="text-lg mb-2">마진 모드 설정</h2>
            <button onClick={() => { setMarginMode("cross"); setShowMarginModal(false); }} className="block w-full py-2 mb-2 bg-gray-700 text-white rounded">교차</button>
            <button onClick={() => { setMarginMode("isolated"); setShowMarginModal(false); }} className="block w-full py-2 bg-gray-700 text-white rounded">격리</button>
          </div>
        </Modal>
      )}

      {/* 레버리지 설정 모달 */}
      {showLeverageModal && (
        <Modal onClose={() => setShowLeverageModal(false)}>
          <div className="p-4">
            <h2 className="text-lg mb-2">레버리지 설정</h2>
            <input type="number" value={leverage} min={1} max={100} onChange={(e) => setLeverage(e.target.value)} className="w-full mb-2 p-1 bg-gray-800 text-white border border-gray-500 rounded" />
            <button onClick={() => setShowLeverageModal(false)} className="w-full py-2 bg-orange-600 text-white rounded">확인</button>
          </div>
        </Modal>
      )}
    </div>
  );
}