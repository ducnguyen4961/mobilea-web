'use client';

import { useEffect, useState, type CSSProperties } from "react";
import { useRouter } from "next/navigation";

import MultiDeviceChart from "@/components/chartpage/aChart";
import Button from "@/components/chartpage/bButton";
import Bar from "@/components/chartpage/cBar";
import LandscapeOnly from "@/components/chartpage/dLandscape";

interface ChartProps {
  raw: string | null;
}
export default function GraphPage() {
  const [apiData, setApiData] = useState([])
  //fake data mẫu
  useEffect(() => {
    try {
      const raw = JSON.parse(localStorage.getItem("rawdata") || "[]")
      setApiData(raw)
      console.log("du lieu cam bien", raw)
    } catch {
      setApiData([])
    }
  }, [])

  const [active, setActive] = useState("day");
  const router = useRouter();

  return (
    <div style={styles.wrapper}>
      <LandscapeOnly />
      {/* Cột trái: 8% */}
      <div style={{gap: 10, display: "flex", flexDirection: "column", width: "8%", ...styles.buttonBox }}>
        <Button label="Back" active={false} onClick={() => router.push("/select_chart")} />
        <Button label="Change" active={false} onClick={() => alert("Button clicked!")}/>
        <Button label="Day" active={active==="day"} onClick={() => setActive("day")}/>
        <Button label="Week" active={active==="week"} onClick={() => setActive("week")}/>
        <Button label="Month" active={active==="month"} onClick={() => setActive("month")}/>
      </div>

      {/* Cột phải: 92% */}
      <div style={{ width: "92%", paddingBottom: "8%", minWidth: 0 }}>
          <MultiDeviceChart raw={apiData as any} />
      </div>
      <Bar label={active} onClick={() => alert("Bar clicked!")}/>
    </div>
  );
}

const styles: {
  wrapper: CSSProperties;
  buttonBox: CSSProperties;
} = {
  wrapper: {
    display: "flex", // sử dụng flexbox để căn chỉnh nội dung bên trong
    flexDirection: "row", // xếp phần tử con gồm ButtonBox và ChartBox theo hàng ngang
    alignItems: "flex-start", // căn phần tử con theo phía trên của container
  },

  buttonBox: {
    display: "flex", // sử dụng flexbox để căn chỉnh nội dung bên trong
    flexDirection: "column", // xếp phần tử con gồm các Button theo cột dọc

    justifyContent: "flex-start", // căn phần tử con theo phía bên trái của container
    alignItems: "flex-start", // căn phần tử con theo phía trên của container

    position: "sticky", // giữ phần tử ở vị trí cố định khi cuộn trang
    top: 10,
    height: "fit-content", 
  }
}

