import React, { useState } from "react";

// ChartAnalysisPage: 사용자가 차트 이미지를 업로드하고 분석 결과를 확인할 수 있는 페이지
// 추후 mockinvest처럼 컴포넌트로 분리예정정
export default function ChartAnalysisPage() {
  const [selectedImage, setSelectedImage] = useState(null); // 사용자가 업로드한 원본 이미지
  const [previewURL, setPreviewURL] = useState(""); // 업로드한 이미지를 브라우저에서 미리보기용 URL로 변환한 값

  const [resultImageURL, setResultImageURL] = useState("");  // 추론 결과 이미지 URL
  const [patternLabel, setPatternLabel] = useState("");  // 추론한 패턴명(클래스명)

  const [symbol, setSymbol] = useState("BTCUSDT"); // UI구상용 더미버튼 (기간골라 분석하는 기능)
  const [startDate, setStartDate] = useState(""); // UI구상용 더미버튼 (기간골라 분석하는 기능)
  const [endDate, setEndDate] = useState(""); // UI구상용 더미버튼 (기간골라 분석하는 기능)

  const [loading, setLoading] = useState(false);  // 분석 요청 중인지? 표시하는놈 (버튼 비활성화 or 로딩 메시지용)

  const backendURL = process.env.REACT_APP_BACKEND_URL || "http://127.0.0.1:8000";   // 백엔드 API URL 설정 (.env로 가져오거나 기본값)

  const handleImageChange = (e) => {  // 이미지 파일 변경 시 호출
    const file = e.target.files[0]; // 선택한 첫 번째 파일
    if (file) {
      setSelectedImage(file); // 상태에 저장
      setPreviewURL(URL.createObjectURL(file)); // 브라우저에서 표시할 수 있도록 URL 생성
      setResultImageURL(""); // 이전 결과 초기화
      setPatternLabel("");
    }
  };

 
  const handleUploadAnalysis = () => { // "이미지 분석 요청" 버튼 클릭 시 호출
    if (!selectedImage) return alert("이미지를 선택해주세요."); // 파일 선택 안했을 경우 안내창

    setLoading(true); // 로딩 시작

    const formData = new FormData(); // 폼 데이터 객체 생성 (multipart/form-data)
    formData.append("image", selectedImage); // 이미지 파일 첨부

    // 백엔드에 이미지 요청하는 부분
    fetch(`${backendURL}/chart/analysis/image/`, {
      method: "POST", //GET쓰기? POST쓰기??
      body: formData,
    })

    // 응답 받아 처리하고 상태 갱신하는 부분
      .then(res => res.json())  // JSON 응답 파싱
      .then(data => {           // 응답에서 결과 이미지 경로와 감지된 클래스명 저장
        setResultImageURL(data.result_image_url); // 예: /media/result.jpg
        setPatternLabel(data.class_name);         // 클래스명: 헤드앤숄더, 상승삼각수렴...등등 설명을 프론트에서 따로 컴포넌트 만들어 처리하는게 좋을듯
      })
    // 망했을때 오류띄우는부분
      .catch(err => {
        console.error("오류:", err);
        alert("분석 중 오류가 발생했습니다.");
      })
      .finally(() => setLoading(false)); // 로딩 종료
  };

  // 아직 미구현임
  const handleDummySymbolAnalysis = () => { // 기간종목골라 차트분석 버튼 클릭 시 호출
    alert("미구현입니다"); // 알림만 출력
  };

  //컴포넌트 렌더링 영역 js주석 작동안하는거 생각하기
  return (
    <div className="p-6 space-y-8 text-white">
      {/*이미지 업로드 분석*/}
      <section>
        <h2 className="text-xl font-semibold mb-2">이미지를 업로드하여 분석</h2>

        {/* 이미지 선택 input */}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="text-white mb-2"
        />

        {/* 이미지 미리보기 */}
        {previewURL && (
          <img src={previewURL} alt="미리보기" className="w-96 mb-2 border" />
        )}

        {/* 분석 요청 버튼 */}
        <button
          onClick={handleUploadAnalysis}
          className="px-4 py-2 bg-long text-newWhiteText rounded disabled:opacity-50"
          disabled={loading} // 로딩 중이면 버튼 비활성화
        >
          이미지 분석 요청
        </button>

        {/* 로딩 메시지 */}
        {loading && <p className="text-yellow-400 mt-2">분석 중입니다...</p>}

        {/* 분석 결과 이미지 및 패턴 출력 */}
        {resultImageURL && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">분석 결과</h3>
            <img
              src={resultImageURL}
              alt="분석 결과 이미지"
              className="w-96 border mb-2"
            />
            <p className="text-base">
              감지된 패턴: <span className="font-semibold">{patternLabel}</span>
            </p>
          </div>
        )}
      </section>

      {/*종목 및 기간 선택 섹션 (미구현)*/}
      <section>
        <h2 className="text-xl font-semibold mb-2">종목과 기간을 선택하여 분석 (준비 중)</h2>

        {/*드롭다운과 날짜 선택기*/}
        <div className="space-x-4 mb-2">
          <select
            value={symbol}
            onChange={e => setSymbol(e.target.value)}
            className="bg-newBox text-white p-1 rounded"
          >
            <option value="BTCUSDT">BTCUSDT</option> {/*임시 비트*/}
            <option value="ETHUSDT">ETHUSDT</option> {/*임시 이더*/}
            <option value="AAPL">AAPL</option> {/*임시 애플*/}
          </select>
          <input
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            className="bg-newBox p-1 rounded"
          />
          <input
            type="date"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            className="bg-newBox p-1 rounded"
          />
        </div>

        {/*더미 버튼*/}
        <button
          onClick={handleDummySymbolAnalysis}
          className="px-4 py-2 bg-gray-500 text-white rounded"
        >
          차트 생성 및 분석
        </button>
      </section>
    </div>
  );
}