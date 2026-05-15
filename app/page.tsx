'use client';
import {CSSProperties, useEffect, useState} from 'react';


import InfoCard from "@/components/homepage/aInforCard";
import DeviceBar from "@/components/homepage/bDeviceBar";
import { usePollingData } from "@/hook/polling";

export default function Home() {
  // khai báo biến nhận từ hàm con rồi set cho cha để sử dụng chung
  const [devices, setDevices] = useState<string[]>([]);

  // Gọi và khai báo hàm mà component con (DeviceBar) truyền lên cho cha
  function handleReceiveDevice(devicesFromComponent: string[]) {
    setDevices(devicesFromComponent);
    console.log(devicesFromComponent);
  }
  usePollingData(devices);

  return (
    <div>
      <DeviceBar onTrans={handleReceiveDevice}/>
      <div style={{...styles.container,marginTop: 70,}}>
        {devices.map((d) => {
          return (
            <div style={styles.params}>
              <div style={styles.label}> {d} </div>
              <InfoCard title="Temp" value={25} unit="°C" color="#ff4d4f" />
              <InfoCard title="Humidity" value={60} unit="%" color="#1677ff" />
            </div>
          )
        })}
      </div>
    </div>
  );
}

//Styles------------------------------------------
const styles:{
  container: CSSProperties;
  params: CSSProperties;
  label: CSSProperties;
} = {
  container: {
    marginTop:70,

  },

  params: {
    display: "flex",
    gap: 16,
  },

  label: {
    display: "flex",
    gap: 16,
  },

}
