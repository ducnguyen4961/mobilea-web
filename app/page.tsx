'use client';
import {CSSProperties, useEffect, useState} from 'react';


import InfoCard from "@/components/homepage/aInforCard";
import DeviceBar from "@/components/homepage/bDeviceBar";
import { usePollingData } from "@/hook/polling";

export default function Home() {
  // khai báo biến nhận từ hàm con rồi set cho cha để sử dụng chung
  const [devices, setDevices] = useState<string[]>([]);
  const [house_device, setHouse_device] = useState<string[]>([]);

  usePollingData(house_device);

  // Gọi và khai báo hàm mà component con (DeviceBar) truyền lên cho cha
  function handleReceiveDevice(data: {
    devicesFromComponent: string[];
    house_deviceFromComponent: string[];
  }) {
    setDevices(data.devicesFromComponent);
    setHouse_device(data.house_deviceFromComponent);
    console.log("dữ liệu sau khi ghép", house_device)
  }


  return (
    <div>
      <DeviceBar onTrans={handleReceiveDevice}/>
      <div style={{...styles.container,marginTop: 70,}}>
        {devices.map((d) => {
          return (
            <div key={d} style={styles.params}>
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
