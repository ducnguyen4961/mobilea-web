'use client';

import { useEffect } from "react";
import { homecallAPI } from "@/services/callAPI";

export function usePollingData(deviceIds: string[]) {
    useEffect(() => {
        if (deviceIds.length === 0) return;

        const loadData = async () => {
            const data = await homecallAPI(deviceIds.join(","));
        };

        loadData();

        const interval = setInterval(loadData, 5 * 60 * 1000);

        return () => clearInterval(interval);
    }, [deviceIds]);
}
