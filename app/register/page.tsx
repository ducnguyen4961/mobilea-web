'use client';
import { useRouter } from 'next/navigation';
import { CSSProperties, useState } from 'react';

import Threshold from "@/components/registerpage/aThreshold";
import Cultivation from "@/components/registerpage/bCultivation";
import Location from "@/components/registerpage/cLocation";
import AdditionTemp from "@/components/registerpage/dAdditionTemp";
import AdditionPPFD from "@/components/registerpage/eAdditionPPFD";
import AdditionTrans from "@/components/registerpage/fAdditionTrans";
import AdditionPhoton from "@/components/registerpage/gAdditionPhoton";
import CustomName from "@/components/registerpage/hCustomName";
import DeviceConnector from "@/components/registerpage/iDeviceConnect";
import useOrientation from "@/hook/useOrientation";

export default function Register() {
  const router = useRouter();
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const { isLandscape, isPortrait } = useOrientation();

  return (
    <div style={styles.container}>
      <div style={{...styles.card, marginBottom: isLandscape ? 50:0}}>
        <div style={styles.buttonGrid}>
          <button style={styles.button} onClick={() => setActiveModal("threshold")}>閾値</button>
          <button style={styles.button} onClick={() => setActiveModal("cultivation")}>栽培</button>
          <button style={styles.button} onClick={() => setActiveModal("location")}>緯度・経度</button>
          <button style={styles.button} onClick={() => setActiveModal("additionTemp")}>積算温度</button>
          <button style={styles.button} onClick={() => setActiveModal("additionPPFD")}>積算PPFD</button>
          <button style={styles.button} onClick={() => setActiveModal("additionTrans")}>積算蒸散量</button>
          <button style={styles.button} onClick={() => setActiveModal("additionPhoton")}>積算光合成量</button>
          <button style={styles.button} onClick={() => setActiveModal("customName")}>ハウス・デバイス名</button>
          <button style={styles.button} onClick={() => setActiveModal("deviceConnect")}>デバイス接続</button>
        </div>
        <Threshold isOpen={activeModal === "threshold"} onClose={() => setActiveModal(null)}/>
        <Cultivation isOpen={activeModal === "cultivation"} onClose={() => setActiveModal(null)}/>
        <Location isOpen={activeModal === "location"} onClose={() => setActiveModal(null)}/>
        <AdditionTemp isOpen={activeModal === "additionTemp"} onClose={() => setActiveModal(null)}/>
        <AdditionPPFD isOpen={activeModal === "additionPPFD"} onClose={() => setActiveModal(null)}/>
        <AdditionTrans isOpen={activeModal === "additionTrans"} onClose={() => setActiveModal(null)}/>
        <AdditionPhoton isOpen={activeModal === "additionPhoton"} onClose={() => setActiveModal(null)}/>
        <CustomName isOpen={activeModal === "customName"} onClose={() => setActiveModal(null)}/>
        <DeviceConnector isOpen={activeModal === "deviceConnect"} onClose={() => setActiveModal(null)}/> 
      </div>
    </div>
  );
}

const styles: {
  container: CSSProperties;
  card: CSSProperties;
  buttonGrid: CSSProperties;
  button: CSSProperties;
} = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "calc(100vh - 80px)",
    backgroundColor: "#EEF2F6",
    padding: 10,
  },

  card: {
    width: "100%",
    maxWidth: 520,
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    padding: 20,
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
  },

  buttonGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 14,
  },

  button: {
    minHeight: 82,
    border: "1px solid #E4E7EC",
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    color: "#1F2937",
    fontSize: 15,
    fontWeight: 600,
    lineHeight: 1.4,
    cursor: "pointer",
    padding: "12px",
    transition: "all 0.2s ease",
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
  },
};