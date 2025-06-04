import React, { useEffect, useState } from "react";

export default function TradeTables() {
  const [activeTab, setActiveTab] = useState("position");
  const [positions, setPositions] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);  // 추후 구현용
  const [openOrders, setOpenOrders] = useState([]);      // 추후 구현용

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/mockinvest/positions/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();

        const mockCurrentPrice = 21340.0; // 테스트용 현재가

        const enriched = data.map((p) => {
          const entry = parseFloat(p.entry_price);
          const qty = parseFloat(p.quantity);
          const lev = parseFloat(p.leverage);
          let pnl = 0;

          if (p.side === "buy") {
            pnl = (mockCurrentPrice - entry) * qty * lev;
          } else {
            pnl = (entry - mockCurrentPrice) * qty * lev;
          }

          return {
            symbol: p.symbol,
            quantity: qty,
            entry: entry,
            mark: mockCurrentPrice,
            pnl: pnl,
            liq: entry - 200, // 임시 리퀴드가 mock
          };
        });

        setPositions(enriched);
      } catch (err) {
        console.error("포지션 로딩 실패", err);
      }
    };

    fetchPositions();
    const interval = setInterval(fetchPositions, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleCancelOrder = (orderId) => {
    console.log("취소 요청:", orderId);
  };

  return (
    <div className="p-4 border rounded-none bg-layer text-white">
      <div className="flex justify-start gap-4 text-sm border-b border-gray-600 mb-2">
        <button onClick={() => setActiveTab("position")} className={`pb-2 font-semibold ${activeTab === "position" ? "border-b-2 border-yellow-400 text-white" : "text-gray-400"}`}>포지션</button>
        <button onClick={() => setActiveTab("orders")} className={`pb-2 font-semibold ${activeTab === "orders" ? "border-b-2 border-yellow-400 text-white" : "text-gray-400"}`}>주문내역</button>
        <button onClick={() => setActiveTab("open")} className={`pb-2 font-semibold ${activeTab === "open" ? "border-b-2 border-yellow-400 text-white" : "text-gray-400"}`}>미체결</button>
      </div>

      {activeTab === "position" && (
        <table className="w-full text-sm text-left">
          <thead className="text-gray-400 border-b border-gray-600">
            <tr>
              <th>종목</th><th>수량</th><th>진입가</th><th>현재가</th><th>미실현손익</th><th>강제청산가</th>
            </tr>
          </thead>
          <tbody>
            {positions.map((p, i) => (
              <tr key={i} className="text-white">
                <td>{p.symbol}</td>
                <td>{p.quantity}</td>
                <td>{p.entry}</td>
                <td>{p.mark}</td>
                <td className={`font-semibold ${p.pnl >= 0 ? "text-green-400" : "text-red-400"}`}>{p.pnl.toFixed(2)} USDT</td>
                <td>{p.liq}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {activeTab === "orders" && (
        <table className="w-full text-sm text-left">
          <thead className="text-gray-400 border-b border-gray-600">
            <tr>
              <th>종목</th><th>수량</th><th>주문가</th><th>체결가</th><th>거래타입</th><th>주문타입</th><th>상태</th><th>주문번호</th><th>주문시간</th>
            </tr>
          </thead>
          <tbody>
            {orderHistory.map((o, i) => (
              <tr key={i} className="text-white">
                <td>{o.symbol}</td><td>{o.quantity}</td><td>{o.orderPrice}</td><td>{o.filledPrice}</td>
                <td>{o.side}</td><td>{o.type}</td><td>{o.status}</td><td>{o.orderId}</td><td>{o.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {activeTab === "open" && (
        <table className="w-full text-sm text-left">
          <thead className="text-gray-400 border-b border-gray-600">
            <tr>
              <th>종목</th><th>수량</th><th>주문가격</th><th>거래타입</th><th>주문타입</th><th>주문번호</th><th>주문시간</th><th>취소</th>
            </tr>
          </thead>
          <tbody>
            {openOrders.map((o, i) => (
              <tr key={i} className="text-white">
                <td>{o.symbol}</td><td>{o.quantity}</td><td>{o.orderPrice}</td><td>{o.side}</td>
                <td>{o.type}</td><td>{o.orderId}</td><td>{o.time}</td>
                <td><button onClick={() => handleCancelOrder(o.orderId)} className="text-red-500 underline">취소</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}