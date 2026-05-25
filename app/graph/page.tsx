'use client';

import { useEffect, useState, type CSSProperties } from "react";
import { useRouter } from "next/navigation";

import MultiDeviceChart from "@/components/chartpage/aChart";
import Sidebar from "@/components/chartpage/bButton";
import BottomBar from "@/components/chartpage/cBar";
import LandscapeOnly from "@/components/chartpage/dLandscape";
import ChangeButton from "@/components/chartpage/eChange";
import handleTime from "@/components/chartpage/fHandleTime";

// import API để lấy dữ liệu vẽ biểu đồ trong 1 ngày
import { graphcallAPI1minute, graphcallAPI30mins, graphcallAPI1hour, graphcallAPIcustomize } from "@/services/callAPI";

type DeviceMap = Record<string, string[]>;
type Payload = {
  housedeviceIds: string[];
  starttime?: string; // có thể không có dữ liệu, khác với việc khai báo starttime: string | null, có giá trị nhưng là rỗng
  endtime?: string;
};

export default function GraphPage() {
  const [apiData, setApiData] = useState([]);
  const [active, setActive] = useState("day");
  const router = useRouter();

  // khai báo thời gian bắt đầu và kết thúc
  const [start, setStart] = useState<string>("");
  const [end, setEnd] = useState<string>("");
  // khai báo danh sách thiết bị
  const [deviceIds, setDeviceIds] = useState<string[]>([]);

  // khai báo biến hiển thị Modal dùng chung để tránh bị lỗi onTrans
  const [openModal, setOpenModal] = useState(false);

  // khai báo trạng thái vô hiệu hóa nút
  const [disable, setDisable] = useState(false);

  // khai báo offset nhận từ cBar
  const [offsets, setOffsets] = useState<number>(0);

  // khai báo khoảng cách ngày người dùng query để điều hướng API
  const [diffs, setDiffs] = useState<number>(1)

  // render lần đầu
  useEffect(() => {
    const {
      startresult,
      endresult,
      diff,
    } = handleTime({
      offset: offsets,
      unit: active,
      start,
      end,
    });
    setStart(startresult);
    setEnd(endresult);
    setDiffs(diff);
  }, []);

  // đoạn này tức là setStart và setEnd khi mà eChange thay đổi thiết bị có chứa thời gian
  function handleDevicesChange({housedeviceIds, starttime, endtime}:Payload){
    setDeviceIds(housedeviceIds);
    if (starttime !== undefined && endtime !== undefined) {
      const start_time = `${starttime}T00:00:00`;
      const end_time = `${endtime}T23:59:59`;
      // gọi hàm xử lý thời gian ở component HandleTime
      const {startresult, endresult, diff} = handleTime({
        offset: offsets,
        unit: "free",
        start: start_time,
        end: end_time
      })
      console.log("ket qua thoi gian", startresult, endresult, diff);
      setStart(startresult);
      setEnd(endresult);
      setDiffs(diff);
      setActive("free");
    }
  }


  // khai báo các hàm API theo Object.map
  const apiMap = {
    day: graphcallAPI1minute,
    week: graphcallAPI30mins,
    month: graphcallAPI30mins,
    free: graphcallAPIcustomize,
  } as const;

  // Call API để lấy dữ liệu vẽ biểu đồ
  async function GraphData() {
    try {
      if(active ==="free") {
        if(diffs === 1) { 
          const raw = await graphcallAPI1minute({start, end, deviceIds});
          setApiData(raw);
        }
        else if(diffs > 1 && diffs <= 31) {
          const raw = await graphcallAPI30mins({start, end, deviceIds});
          setApiData(raw);
        }
        else if(diffs > 31 && diffs <= 60) {
          const raw = await graphcallAPI1hour({start, end, deviceIds});
          setApiData(raw);
        }
        else if(diffs > 60) {
          const raw = await graphcallAPIcustomize({start, end, deviceIds});
          setApiData(raw);
        }
      } else {
        const callAPI = apiMap[active as keyof typeof apiMap];
        if(!callAPI) return;
        const raw = await callAPI({start, end, deviceIds});
        setApiData(raw);
      }
    } catch {
      setApiData([]);
    }
  }

  // Querry lần đầu khi vào 
  useEffect(() => {
    const deviceId = JSON.parse(localStorage.getItem("deviceId") || "{}") as DeviceMap;
    if(deviceId) {
      const entries = Object.entries(deviceId);
      if(entries.length === 0) return;
      const [firsthouse,firstdevice] = entries[0];
      const devicelist = firstdevice.map(d => `${firsthouse}#${d}`);
      setDeviceIds(devicelist);
    }
  }, []);

  useEffect(() => {
    console.log({
    start,
    end,
    deviceIds,
    active
  });
    if (!start || !end || deviceIds.length === 0) return;
    GraphData();
  }, [start, end, deviceIds, active]);

  return (
    <div style={s.root}>
      <LandscapeOnly />

      {/* ── Sidebar trái ── */}
      <Sidebar
        active={active}
        onBack={() => router.push("/select_chart")}
        onPeriod={(key) => {setActive(key);
          const {startresult,endresult,diff,} = handleTime({offset: offsets,unit: key,start,end,});
          setStart(startresult);
          setEnd(endresult);
          setDiffs(diff);
        }}
        onOpenModal={() => setOpenModal(true)}
      />

      <ChangeButton isOpen={openModal} onClose={() => setOpenModal(false)} onTrans={handleDevicesChange} disableStatus={() => {setDisable(true)}}/>

      {/* ── Chart area ── */}
      <div style={s.chartArea}>
        <MultiDeviceChart raw={apiData as any} />
      </div>

      {/* ── Bottom bar ── */}
      <BottomBar label={active} onOffset={(offs) => setOffsets(offs)} onStatus ={disable} starttimestamp={start} endtimestamp={end} diff={diffs} />

    </div>
  );
}

const s: { [k: string]: CSSProperties } = {
  root: {
    position: "fixed",
    inset: 0,
    display: "flex",
    flexDirection: "row",
    backgroundColor: "#0F172A",
    overflow: "hidden",
  },
  chartArea: {
    flex: 1,
    minWidth: 0,
    height: "100vh",
    overflowY: "auto",
    paddingBottom: 44,
  },
};
