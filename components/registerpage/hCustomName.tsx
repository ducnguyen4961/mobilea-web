"use client"

import { useState, CSSProperties } from "react"

interface Props {
  isOpen: boolean
  onClose: () => void
}

export default function CustomName({ isOpen, onClose }: Props) {
  const map = JSON.parse(localStorage.getItem("deviceId") || "{}");
  const houses = Object.keys(map); // lấy tất cả các house = ["H0001D010", "H0001D006", ...]

  const housename = JSON.parse(localStorage.getItem("alias_house") || ""); //Lấy tên danh sách house mà người dùng đặt, chính là dữ liệu raw mà nhận được từ API
  const devicename = JSON.parse(localStorage.getItem("alias_device") || ""); //Lấy tên danh sách device mà người dùng đặt


  const [selectHouse, setSelectHouse] = useState(houses[0] || "");
  const [devices, setDevices] = useState(map[houses[0]]);

  //Khai báo biến nhập customhousename và customdevicename
  const [customhousename, setCustomhousename] = useState<{ [key: string]: string }>({}); //phải dùng dạng Object useState({}) thay cho dạng đơn useState("") nếu không thì sẽ bị trùng giá trị cho cùng nhiều thiết bị 
  const [customdevicename, setCustomdevicename] = useState<{ [key: string]: string }>({});

  // Xử lý dropdown
  const [open, setOpen] = useState(false);

  // Hàm đóng modal
  function handleClose() {
    onClose()
  }
  
  // Hàm thay đổi device khi người dùng chọn house khác
  function handleHouseChange(houseId: any) {
    setSelectHouse(houseId);
    setDevices(map[houseId]); // ở đây phải dùng houseId là giá trị mới nhất, nếu dùng selectHouse thì nó sẽ là giá trị cũ chưa cập nhật
  }

  // Hàm submit gửi lên Lambda
  console.log("Custom House Name:", customhousename);
  console.log("Custom Device Name:", customdevicename);

  if(!isOpen) return null

  return (
    <div style={styles.overlay} onClick={handleClose}> {/* click ra ngoài hoặc vào trong phần component thì đều đóng component này lại */}
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}> {/* chặn lại vấn đề trên bằng cách khi người dùng ấn vào phần modal, còn ấn vào phần overlay thì đóng như thường */}
        <div style={{ position: "relative", display:"flex", flexDirection: "row" , gap:10}}>
          {/* Dropdown */}
          <div style={styles.selectBox} onClick={() => setOpen(!open)}>
            <span>{housename[selectHouse] || selectHouse}</span>
            <span style={{transform: open? "rotate(180deg)" : "rotate(0deg)",transition: "0.2s",}}>▼</span>
          </div>
          <div style={{ flex:1 }}>
            <input style={{...styles.housename, width: "100%"}} value={customhousename[selectHouse] || ""} onChange={(e) => setCustomhousename({...customdevicename,[selectHouse]: e.target.value,})}/>
          </div>
          {open && (
            <div style={styles.dropdown}>
              {houses.map((h) => (
                <div key={h} style={styles.option} onClick={() => { handleHouseChange(h); setOpen(false); }}>{housename[h] || h}</div>
              ))}
            </div>
          )}

        </div>
        <div style={styles.cardList}>
          {devices.map((d: string) => {
            return (
            <div key={d} style={styles.card}>
              <h3 style={styles.deviceTitle}> {devicename[`${selectHouse}#${d}`] || d} </h3> {/* đoạn này xử lý đỉnh vãi chưởng */}
              <div style={styles.params}>
                <div style={styles.field}>
                  <label style={styles.label}> デバイス名 </label>
                  <input style={styles.input} type="text" value={customdevicename[d] || ""} onChange={(e) => setCustomdevicename({...customdevicename,[d]: e.target.value,})}/>
                </div>
              </div>
            </div>
            );
          })}
        </div>
        {/* thêm nút phía dưới */}
        <div style={styles.wrapped}>
          <button style={styles.cancelButton} onClick={handleClose}>キャンセル</button>
          <button style={styles.submitButton} onClick={() => alert("send")}>保存</button>
        </div>
      </div>
    </div>
  )
}

const styles: {
  overlay: CSSProperties;
  modal: CSSProperties;
  selectBox: CSSProperties;
  housename: CSSProperties;
  dropdown: CSSProperties;
  option: CSSProperties;
  cardList: CSSProperties;
  card: CSSProperties;
  deviceTitle: CSSProperties;
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
    padding: 20,
    display: "flex",
    flexDirection: "column",
    gap: 18,
    boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
  },

  selectBox: {
    height: 48,
    minWidth: 0,
    borderRadius: 14,
    backgroundColor: "#F8FAFC",
    border: "1px solid #D0D5DD",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 16px",
    cursor: "pointer",
    fontWeight: 600,
    flex: 1,
  },

  housename: {
    width: "100%",
    height: 48,
    borderRadius: 12,
    border: "1px solid #D0D5DD",
    padding: "0 14px",
    fontSize: 15,
    backgroundColor: "#FFFFFF",
    outline: "none",
    color: "#111827",
    boxSizing: "border-box",
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

  card: {
    backgroundColor: "#F8FAFC",
    borderRadius: 22,
    padding: 18,
    border: "1px solid #E5E7EB",
    boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
  },

  deviceTitle: {
    margin: 0,
    marginBottom: 16,
    fontSize: 18,
    fontWeight: 700,
    color: "#111827",
    letterSpacing: 0.3,
  },

  params: {
    display: "flex",
    flexDirection: "column",
    gap: 14,
  },

  field: {
    display: "flex",
    flexDirection: "column",
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
    backgroundColor: "#000",
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
  },
};