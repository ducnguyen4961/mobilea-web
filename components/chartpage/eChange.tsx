"use client"

import { useState, CSSProperties, useEffect } from "react"

type Payload = {
  housedeviceIds: string[];
  starttime?: string; // có thể không có dữ liệu, khác với việc khai báo starttime: string | null, có giá trị nhưng là rỗng
  endtime?: string;
};

interface Props {
  isOpen: boolean
  onClose: () => void
  onTrans: (devices: Payload) => void;
  disableStatus: () => void
}


// mục tiêu giờ là khi người dùng tùy ý chọn khoảng thời gian để query dữ liệu thì xử lý những vấn đề sau
// xử lý đơn giản là khi mà ấn nút save thì vô hiệu nút tìm sang trái hoặc phải khi mà ấn lại nút day, week, month thì lại quay về như bình thường
// đồng thời khi đó cũng cần phải tắt background của 3 nút day, week, month đi

export default function ChangeButton({ isOpen, onClose, onTrans, disableStatus}: Props) {
  //Khai báo biến thời gian bắt đầu, thời gian kết thúc
  const [start, setStart] = useState<string>("");
  const [end, setEnd] = useState<string>("");
  // khai báo state để đóng mở khung chọn thời gian
  const [showCustomTime, setShowCustomTime] = useState(false);

  // khai báo biến house#device để khi ấn nút Save thì gửi cả thể đi cho page cha
  const [deviceIDs, setDeviceIDs] = useState<string[]>([]);

  // Xử lý dropdown
  const [open, setOpen] = useState(false);

  // khai báo house và thiết bị được lựa chọn
  const [selectHouse, setSelectHouse] = useState("");
  const [devices, setDevices] = useState<string[]>([]);

  const [houses, setHouses] = useState<string[]>([]);
  const [housename, setHousename] = useState<Record<string, string>>({});
  const [map, setMap] = useState<Record<string, string[]>>({});

  // lấy dữ liệu local trong useEffect tránh báo lỗi, và nên render là lấy dữ liệu đầu tiên ngay bên trong thay vì set ở bên ngoài
  useEffect(() => {
    // khai báo biến lấy danh sách thiết bị
    const housedevices = JSON.parse(localStorage.getItem("deviceId") || "{}");
    
    const houselist = Object.keys(housedevices); // lấy tất cả các house = ["H0001D010", "H0001D006", ...]

    const aliashouse = JSON.parse(localStorage.getItem("alias_house") || ""); //Lấy tên danh sách house mà người dùng đặt, chính là dữ liệu raw mà nhận được từ API
    
    setMap(housedevices);
    setHouses(houselist);
    setHousename(aliashouse);

    // gán mặc định khi có dữ liệu
    if(houselist.length > 0) {
      setSelectHouse(houselist[0]);
      const firstDeviceList = housedevices[houselist[0]];
      setDeviceIDs(firstDeviceList.map((d:string) => `${houselist[0]}#${d}`));
    }
  }, [])

  // Hàm đóng modal
  function handleClose() {
    onClose?.()
  }
  // hàm đóng mục chọn thời gian
  useEffect(() => {
    if(!isOpen) {
      setShowCustomTime(false);
    }
  },[isOpen]);
  
  // Hàm thay đổi device khi người dùng chọn house khác
  function handleHouseChange(houseId: any) {
    setSelectHouse(houseId);
    // ghép danh sách nhưng cần phải dùng danh sách mới nhất
    const newDevice = (map[houseId] || []) as string[];
    const house_devices = newDevice.map(d => `${houseId}#${d}`)
    setDeviceIDs(house_devices);
  }

  // Hàm tổng kết lại thiết bị, thời gian khi người dùng chọn rồi sau đó mới gửi, 2 hàm nhận và gửi này nếu là object thì cần khai báo prop giống nhau
  function userSend({housedeviceIds, starttime, endtime}:Payload) {
    console.log("danh sach devices", deviceIDs)
    onTrans({housedeviceIds, starttime, endtime});
  }

  // Hàm đóng mở modal
  if(!isOpen) return null

  return (
    <div style={styles.overlay} onClick={handleClose}> {/* click ra ngoài hoặc vào trong phần component thì đều đóng component này lại */}
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}> {/* chặn lại vấn đề trên bằng cách khi người dùng ấn vào phần modal, còn ấn vào phần overlay thì đóng như thường */}
        <div style={{ position: "relative" }}>
          {/* Dropdown */}
          <div style={styles.selectBox} onClick={() => {setOpen(!open);console.log("house duoc chon",selectHouse)}}> {/* đảo giá trị open để hiển thị phần dropdown  */}
            <span>{housename[selectHouse] || selectHouse}</span>
            <span style={{transform: open? "rotate(180deg)" : "rotate(0deg)",transition: "0.2s",}}>▼</span>
          </div>
          {open && (
            <div style={styles.dropdown}>
              {houses.map((h) => (
                <div key={h} style={styles.option} onClick={() => { handleHouseChange(h); setOpen(false);}}>{housename[h] || h}</div>
              ))}
            </div>
          )}
        </div>
        <div style={styles.cardList}>
          {/* nút bật/tắt */}
          <button style={styles.toggleButton} onClick={() => setShowCustomTime(prev => {
            if(prev === true) {
              setStart("");
              setEnd("");
            }
            return !prev;
          })}>
            {showCustomTime ? "閉じる" : "時間を指定"}
          </button>
          {/* chỉ hiển thị khi bấm nút */}
          {showCustomTime && (
            <div style={styles.card}>
              <div style={styles.params}>
                <div style={styles.field}>
                  <label style={styles.label}>開始時刻</label>
                  <input style={styles.input} type="date" value={start || ""} onChange={(e) => setStart(e.target.value)}/>
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>完了時刻</label>
                  <input style={styles.input} type="date" value={end || ""} onChange={(e) => setEnd(e.target.value)}/>
                </div>
              </div>
            </div>
          )}
        </div>
        {/* thêm nút phía dưới */}
        <div style={styles.wrapped}>
          <button style={styles.cancelButton} onClick={handleClose}>Cancel</button>
          <button style={styles.submitButton} onClick={() => {userSend({housedeviceIds: deviceIDs, starttime: start, endtime: end}); handleClose(); if (start && end) {disableStatus(); }}}>Save</button>
        </div>
      </div>
    </div>
  )
}

const styles: {
  overlay: CSSProperties;
  modal: CSSProperties;
  selectBox: CSSProperties;
  dropdown: CSSProperties;
  option: CSSProperties;
  cardList: CSSProperties;
  toggleButton: CSSProperties;
  card: CSSProperties;
  params: CSSProperties;
  field: CSSProperties;
  label: CSSProperties;
  input: CSSProperties;
  wrapped: CSSProperties;
  cancelButton: CSSProperties;
  submitButton: CSSProperties;
} = {
  overlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(15, 23, 42, 0.45)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    zIndex: 1000,
    backdropFilter: "blur(3px)",
  },
  modal: {
    width: "100%",
    maxWidth: 460,
    maxHeight: "85dvh",
    overflowY: "auto",
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    padding: 24,
    display: "flex",
    flexDirection: "column",
    gap: 18,
    boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
  },

  selectBox: {
    height: 48,
    borderRadius: 14,
    backgroundColor: "#F8FAFC",
    border: "1px solid #D0D5DD",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 16px",
    cursor: "pointer",
    fontWeight: 600,
  },
  
  dropdown: {
    position: "absolute",   // ← thoát khỏi flow
    top: "100%",            // ← hiện ngay dưới selectBox
    left: 0,
    right: 0,
    zIndex: 2000,           // ← cao hơn modal (1000)
    marginTop: 4,
    borderRadius: 16,
    backgroundColor: "#fff",
    border: "1px solid #E5E7EB",
    overflow: "hidden",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
  },

  option: {
    padding: 14,
    cursor: "pointer",
    borderBottom: "1px solid #F1F1F1",
  },


  cardList: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },

  toggleButton: {
    padding: "10px 16px",
    borderRadius: "10px",
    border: "none",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "bold",
  },

  card: {
    backgroundColor: "#F8FAFC",
    borderRadius: 22,
    padding: 18,
    border: "1px solid #E5E7EB",
    boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
  },

  params: {
    display: "flex",
    flexDirection: "row",
    gap: 14,
  },

  field: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    gap: 6,
  },

  label: {
    fontSize: 14,
    fontWeight: 600,
    color: "#475467",
  },

  input: {
    height: 44,
    borderRadius: 12,
    border: "1px solid #D0D5DD",
    padding: "0 14px",
    fontSize: 15,
    backgroundColor: "#FFFFFF",
    outline: "none",
    color: "#111827",
  },

  wrapped: {
    display: "flex",
    gap: 12,
    marginTop: 8,
  },

  cancelButton: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    border: "1px solid #D0D5DD",
    backgroundColor: "#FFFFFF",
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
  },
  submitButton: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    border: "none",
    backgroundColor: "#2563EB",
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
  },
};