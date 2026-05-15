"use client"

import { useState, CSSProperties } from "react"

interface Props {
  isOpen: boolean
  onClose: () => void
}

export default function Cultivation({ isOpen, onClose }: Props) {
  const map = JSON.parse(localStorage.getItem("deviceId") || "{}");
  const houses = Object.keys(map); // lấy tất cả các house = ["H0001D010", "H0001D006", ...]

  const housename = JSON.parse(localStorage.getItem("alias_house") || ""); //Lấy tên danh sách house mà người dùng đặt, chính là dữ liệu raw mà nhận được từ API
  const devicename = JSON.parse(localStorage.getItem("alias_device") || ""); //Lấy tên danh sách device mà người dùng đặt


  const [selectHouse, setSelectHouse] = useState(houses[0] || "");
  const [devices, setDevices] = useState(map[houses[0]]);

  //Khai báo biến nhập
  const [area, setArea] = useState<{ [key: string]: string }>({}); //栽培面積
  const [beds, setBeds] = useState<{ [key: string]: string }>({}); //栽培ベッド
  const [plant, setPlant] = useState<{ [key: string]: string }>({}); //株間
  const [row, setRow] = useState<{ [key: string]: string }>({}); //条間
  const [variety, setVariety] = useState<{ [key: string]: string }>({}); //品種
  const [planting, setPlanting] = useState<{ [key: string]: string }>({}); //植え方
  const [multicolor, setMulticolor] = useState<{ [key: string]: string }>({}); //マルチ色



  // Xử lý dropdown
  const [open, setOpen] = useState(false); // dropdown cho thiết bị

  const [openA, setOpenA] = useState<string | null>(null); // dropdown cho params
  const [openB, setOpenB] = useState<string | null>(null); // dropdown cho params
  const [openC, setOpenC] = useState<string | null>(null); // dropdown cho params



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
          {devices.map((d: string) => {
            return (
            <div key={d} style={styles.card}>
              <h3 style={styles.deviceTitle}> {devicename[`${selectHouse}#${d}`] || d} </h3> {/* đoạn này xử lý đỉnh vãi chưởng */}
              <div style={styles.params}>
                <div style={styles.field}>
                  <label style={styles.label}> 栽培面積(m²)</label>
                  <input style={styles.input} type="number" value={area[d] || ""} onChange={(e) => setArea({...area,[d]: e.target.value,})}/>
                </div>
                <div style={styles.field}>
                  <label style={styles.label}> 栽培ベッド(m) </label>
                  <input style={styles.input} type="number" value={beds[d] || ""} onChange={(e) => setBeds({...beds,[d]: e.target.value,})}/>
                </div>
                <div style={styles.field}>
                  <label style={styles.label}> 株間(cm) </label>
                  <input style={styles.input} type="number" value={plant[d] || ""} onChange={(e) => setPlant({...plant,[d]: e.target.value,})}/>
                </div>
                <div style={styles.field}>
                  <label style={styles.label}> 条間(cm) </label>
                  <input style={styles.input} type="number" value={row[d] || ""} onChange={(e) => setRow({...row,[d]: e.target.value,})}/>
                </div>
                {/* thêm các dropdown mặc định */}
                <div style={{ ...styles.field, position: "relative" }}>
                  <label style={styles.label}> 品種 </label>
                  <div style={styles.customSelect} onClick={() => setOpenA(openA === d ? null : d)}>
                    <span>{variety[d] || "なし"}</span>
                    <span style={{transform: openA === d ? "rotate(180deg)" : "rotate(0deg)",transition: "0.2s",}}>▼</span>
                  </div>
                  {openA === d && (
                    <div style={styles.customDropdown}>
                      {["紅ほっぺ", "きらぴ香"].map((item) => (
                        <div key={item} style={styles.customOption} onClick={() => {setVariety({...variety,[d]: item,});setOpenA(null);}}>{item}</div>
                      ))}
                    </div>
                  )}
                </div>
                {/* thêm các dropdown mặc định */}
                <div style={{ ...styles.field, position: "relative" }}>
                  <label style={styles.label}> 植え方 </label>
                  <div style={styles.customSelect} onClick={() => setOpenB(openB === d ? null : d)}>
                    <span>{planting[d] || "なし"}</span>
                    <span style={{transform: openB === d ? "rotate(180deg)" : "rotate(0deg)",transition: "0.2s",}}>▼</span>
                  </div>
                  {openB === d && (
                    <div style={styles.customDropdown}>
                      {["千鳥", "方形"].map((item) => (
                        <div key={item} style={styles.customOption} onClick={() => {setPlanting({...plant,[d]: item,});setOpenB(null);}}>{item}</div>
                      ))}
                    </div>
                  )}
                </div>
                {/* thêm các dropdown mặc định */}
                <div style={{ ...styles.field, position: "relative" }}>
                  <label style={styles.label}> マルチ色 </label>
                  <div style={styles.customSelect} onClick={() => setOpenC(openC === d ? null : d)}>
                    <span>{multicolor[d] || "なし"}</span>
                    <span style={{transform: openC === d ? "rotate(180deg)" : "rotate(0deg)",transition: "0.2s",}}>▼</span>
                  </div>
                  {openC === d && (
                    <div style={styles.customDropdown}>
                      {["透明", "黒", "白", "シルバー"].map((item) => (
                        <div key={item} style={styles.customOption} onClick={() => {setMulticolor({...multicolor,[d]: item,});setOpenC(null);}}>{item}</div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            );
          })}
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
  card: CSSProperties;
  deviceTitle: CSSProperties;
  params: CSSProperties;
  field: CSSProperties;
  label: CSSProperties;
  input: CSSProperties;
  customSelect: CSSProperties;
  customDropdown: CSSProperties;
  customOption: CSSProperties;
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
    flexWrap: "wrap",
    gap: 14,
  },

  field: {
    width: "45%",
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
    height: 30,
    borderRadius: 10,
    border: "1px solid #D0D5DD",
    padding: "0 14px",
    fontSize: 15,
    backgroundColor: "#FFFFFF",
    outline: "none",
    color: "#111827",
  },
  // các dropdown của phần chọn params
  customSelect: {
    height: 30,
    borderRadius: 10,
    backgroundColor: "#F8FAFC",
    border: "1px solid #D0D5DD",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 16px",
    cursor: "pointer",
    fontWeight: 500,
    transition: "0.2s",
    position: "relative",
  },


  customDropdown: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    marginTop: 6,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    border: "1px solid #E5E7EB",
    overflow: "hidden",
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
    zIndex: 9999,
  },
  customOption: {
    padding: "14px 16px",
    cursor: "pointer",
    transition: "0.15s",
    borderBottom: "1px solid #F3F4F6",
  },
  // phần nút bấm phía dưới
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