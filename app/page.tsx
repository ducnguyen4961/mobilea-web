'use client';

interface ReceiveData {
  house_device: string;
  timestamp: string;
  [key: string]: string | number;
}

// CHÚ Ý: có vẻ như mình đang khai báo thừa và không sử dụng biến devices
import {CSSProperties, useEffect, useState, useRef} from 'react';


import InfoCard from "@/components/homepage/aInforCard";
import DeviceBar from "@/components/homepage/bDeviceBar";
import { usePollingData } from "@/hook/polling";

export default function Home() {
  // khai báo biến nhận từ hàm con rồi set cho cha để sử dụng chung
  const [devices, setDevices] = useState<string[]>([]);
  const [house_device, setHouse_device] = useState<string[]>([]);

  // khai báo biến nhận dữ liệu mới nhất
  const [lastTimeData, setLastTimeData] = useState<ReceiveData[]>([]);

  // khai báo biến set tên người dùng đặt cho devices, lưu ý cái này là Object chứ không phải là mảng
  const [deviceName, setDeviceName] = useState<Record<string, string>>({});

  // Gọi và khai báo hàm mà component con (DeviceBar) truyền lên cho cha
  function handleReceiveDevice(data: {
    devicesFromComponent: string[];
    house_deviceFromComponent: string[];
  }) {
    setDevices(data.devicesFromComponent);
    setHouse_device(data.house_deviceFromComponent);
  }
  // sử dụng biến data oke vì không nằm trong scope trên
  const data = usePollingData(house_device);

  // khai báo biến thời gian
  const timestampRef = useRef("");
  
  // truyền dữ liệu cho lastTimeData để render
  useEffect(() => {
    if (!data) return;
    const lasttime = lastTimewithDevice(data);
    const timestamp = Times(lasttime);

    timestampRef.current = timestamp;

    setLastTimeData(lasttime);

    const alias_device = JSON.parse(localStorage.getItem("alias_device") || "{}");
    setDeviceName(alias_device);
  },[data])

  // hàm lấy các object có timestamp sớm nhất
  function lastTimewithDevice(data: ReceiveData[] | null) {
    if (!data) return [];
    const grouped = data.reduce((acc: Record<string, ReceiveData>, item) => {
      const dev = item.house_device;
      if (!acc[dev] || item.timestamp > acc[dev].timestamp) {
        acc[dev] = item;
      }
      return acc;
    }, {} as Record<string, ReceiveData>);
    return Object.values(grouped);
  }

  // Triển khai hàm xử lý thời gian, tìm thời gian muộn nhất
  function Times(data: ReceiveData[] | null) {
    if (!data) return "";
    const timing = data.map(item => item.timestamp);
    const last_timing = timing.reduce((a, b) => (a > b ? a : b));
    // xử lý xóa đơn vị giây
    const truncated = last_timing.slice(0, 16);
    // xóa "T" đi
    const formatted = truncated.replace("T", " ")
    return formatted;
  }


  return (
    <div>
      <DeviceBar onTrans={handleReceiveDevice} timestamp={timestampRef.current}/>
      <div style={{ ...styles.container, }}>      
        {lastTimeData.map((item) => {
          const findDevice = item["house_device"];
          const shortId = findDevice.includes("#")
            ? findDevice.split("#")[1]
            : findDevice;

          const { house_device, timestamp, RSSI, ...rest } = item;
          return (
            <div key={findDevice} style={styles.wrapped}>
              <div style={styles.label}> {deviceName[findDevice] || shortId} </div>
              
              <div style={styles.cardsContainer}>
                {Object.entries(rest).map(([key, value]) => (
                  <InfoCard key={key} title={key} value={value}/>
                ))}
              </div>
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
  wrapped: CSSProperties;
  label: CSSProperties;
  cardsContainer: CSSProperties;

} = {

  container: {
    marginTop: 70,
    marginBottom: 70,
  },

  wrapped: {
    marginBottom: 24,
  },

  label: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },

  cardsContainer: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 16,
  },
}