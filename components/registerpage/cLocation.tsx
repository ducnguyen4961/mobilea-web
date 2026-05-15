"use client"

import { useState, CSSProperties } from "react";

interface Props {
  isOpen: boolean
  onClose: () => void
};

import LocationPicker from "./jLocationPicker";

export default function Location({ isOpen, onClose }: Props) {
  const map = JSON.parse(localStorage.getItem("deviceId") || "{}");
  const houses = Object.keys(map); // lấy tất cả các house = ["H0001D010", "H0001D006", ...]

  const housename = JSON.parse(localStorage.getItem("alias_house") || ""); //Lấy tên danh sách house mà người dùng đặt, chính là dữ liệu raw mà nhận được từ API


  const [selectHouse, setSelectHouse] = useState(houses[0] || "");
  const [devices, setDevices] = useState([]);

  //Khai báo biến của maps
  const [showMap, setShowMap] = useState(false)
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)


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

  if(!isOpen) return null

  return (
    <div style={styles.overlay} onClick={handleClose}> {/* click ra ngoài hoặc vào trong phần component thì đều đóng component này lại */}
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}> {/* chặn lại vấn đề trên bằng cách khi người dùng ấn vào phần modal, còn ấn vào phần overlay thì đóng như thường */}
        <div style={{ position: "relative" }}>
          {/* Dropdown */}
          <div style={styles.selectBox} onClick={() => setOpen(!open)}>
            <span>{housename[selectHouse] || selectHouse}</span>
            <span style={{transform: open? "rotate(180deg)" : "rotate(0deg)",transition: "0.2s",}}>▼</span>
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
          <button style={styles.buttonpick} onClick={() => setShowMap(true)}>Chọn vị trí</button>
          {location && (
            <p>Đã chọn: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}</p>
          )}
          <LocationPicker isOpen={showMap} onClose={() => setShowMap(false)} onConfirm={(lat, lng) => setLocation({ lat, lng })}/>
        </div>
        {/* thêm nút phía dưới */}
        <div style={styles.wrapped}>
          <button style={styles.cancelButton} onClick={handleClose}>Cancel</button>
          <button style={styles.submitButton} onClick={() => alert("send")}>Save</button>
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
  buttonpick: CSSProperties;
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
  //nút bấm chọn vị trí
  buttonpick: {
    background: "#000",       // ✔ đen tuyệt đối
    color: "#fff",            // ✔ chữ trắng
    padding: "12px 20px",     // ✔ phải là string
    border: "none",
    borderRadius: 10,         // ✔ camelCase, không dùng border-radius
    fontSize: 18,             // ✔ camelCase
    fontWeight: 600,          // ✔ camelCas
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