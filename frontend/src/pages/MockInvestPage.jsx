import React from "react";
import TradePanel from "../components/TradePanel";
import TradeTables from "../components/TradeTables";
import TradingViewWidget from "../components/TradingViewWidget";

export default function MockInvestPage() {
  return (
    <div className="max-w-screen-xl mx-auto p-4">
      <div className="grid grid-cols-[3fr_1fr] gap-4">
        <div className="h-[500px] border rounded-none overflow-hidden">
          <div className="h-[500px] border rounded-none overflow-hidden">
            <div className="h-[500px] border rounded-none overflow-hidden">
              <div className="h-[500px] border rounded-none overflow-hidden">
                <div className="h-[500px] border rounded-none overflow-hidden">
                  <TradingViewWidget />
                </div>
              </div>
            </div>
          </div>
        </div>
        <TradePanel symbol="ETHUSDT" marketPrice={108790.0} /> {/* 테스트용 심볼, 시장가임 */}
      </div>
      <div className="mt-2 border rounded-none">
        <TradeTables />
      </div>
    </div>
  );
}