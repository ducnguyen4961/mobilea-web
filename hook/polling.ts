'use client';
interface ReceiveData {
  house_device: string;
  timestamp: string;
  [key: string]: string | number;
}


import { useEffect, useState } from "react";
import { homecallAPI } from "@/services/callAPI";

export function usePollingData(deviceIds: string[]) {
    const [receiveAPIdata, setReceiveAPIdata] = useState<ReceiveData[] | null>(null);
    useEffect(() => {
        if (deviceIds.length === 0) return;

        const loadData = async () => {
            const data = await homecallAPI(deviceIds);
            setReceiveAPIdata(data); // đặt bên trong scope
        };

        loadData();

        const interval = setInterval(loadData, 5 * 60 * 1000);

        return () => clearInterval(interval);
    }, [deviceIds]);
    // trả về dữ liệu
    return receiveAPIdata;
}
