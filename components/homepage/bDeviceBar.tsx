'use client';
import {useEffect, useState, CSSProperties } from 'react';
interface Props{
    onTrans: (devices: string[]) => void;
}

export default function DeviceBar({onTrans}: Props) {
    const [map, setMap] = useState<{ [key: string]: string[] }>({});
    const [housename, setHousename] = useState<{ [key: string]: string}>({});
    const [devicename, setDevicename] = useState<{ [key: string]: string}>({});

    const [open, setOpen] = useState(false);
    
    // khai báo 
    const [selectHouse, setSelectHouse] = useState<string>("");
    const [devices, setDevices] = useState<string[]>([]);

    // khai báo biến để ghép house#device để query dữ liệu
    const [house_device, setHouse_device] = useState<string[]>([]);
    
    // lỗi chưa hiển thị house vì useEffect chưa hoạt động, phải render xong mới hoạt động nhưng khi đó thì selectHouse lúc này là rỗng, nên phải sửa như sau
    useEffect(() => {
        const rawdata = JSON.parse(localStorage.getItem("deviceId") || "");
        if(rawdata) {
          setMap(rawdata);

          // đoạn này phải thêm ngay phần house để khi render nó nhận ngay giá trị đầu tiên
          const houses = Object.keys(rawdata);
          if(houses.length > 0){
            setSelectHouse(houses[0] || "");
            setDevices(map[houses[0]] || []);
          }
        }
        const alias_house = JSON.parse(localStorage.getItem("alias_house") || "");
        if(alias_house) {
          setHousename(alias_house);
        }
        const alias_device = JSON.parse(localStorage.getItem("alias_device") || "");
        if(alias_device) {
          setDevicename(alias_device);
        }
    },[]);

    const houses = Object.keys(map); // lấy house tách ra
    


    function handleHouseChange(houseId: string) {
        setSelectHouse(houseId);
        setDevices(map[houseId] || []);
    }

    // hàm truyền lại danh sách devices cho trang chính
    function handleTransDevices(){
        onTrans(devices);
    }

    return (
        <div style={styles.topbar}>
            <div style={{...styles.grid, backgroundColor: '#f2f4f7'}}>
                <div style={{...styles.selectBox, gap: 10}} onClick={() => setOpen(!open)}>
                    <span>{housename[selectHouse] || selectHouse}</span>
                    <span style={{transform: open? "rotate(180deg)" : "rotate(0deg)",transition: "0.2s",}}>▼</span>
                </div>
                {open && (
                    <div style={styles.dropdown}>
                        {houses.map((h) => (
                            <div key={h} style={styles.option} onClick={() => { handleHouseChange(h); setOpen(false); handleTransDevices() }}>{housename[h] || h}</div>
                        ))}
                    </div>
                )}
            </div>
            <div style={{...styles.grid, backgroundColor: '#e8f5e9'}}>
                <div style={styles.timestamp}> hello </div>
            </div>
        </div>
    )
};

const styles:{
    topbar: CSSProperties;
    grid: CSSProperties;
    selectBox: CSSProperties;
    dropdown: CSSProperties;
    option: CSSProperties;
    house_name: CSSProperties;
    device_name: CSSProperties;
    timestamp: CSSProperties;
} = {
    topbar: {
        position: 'fixed', // giữ thanh bar ở vị trí cố định
        top: 0, // ghim thanh bar vào mép trên màn hình
        left: 0, // căn sát mép trái màn hình
        width: '100%', //  chiếm toàn bộ chiều ngang màn hình
        height: 60, 
        backgroundColor: '#fff',
        borderBottom: '1px solid #ddd', // tạo đường viền phía dưới để phân tách nội dung
        display: 'flex', // sử dụng flexbox để căn chỉnh nội dung bên trong
        alignItems: 'center', // căn nội dung theo chiều dọc -> nằm giữa thanh bar
        zIndex: 100, // đảm bảo thanh bar hiển thị trên các phần tử khác (nếu có)
    },

    grid: {
        width: '50%', // chiếm 50% chiều ngang màn hình
        height: '100%', // chiếm toàn bộ chiều cao của thanh bar
        display: 'flex',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        fontSize: 16,
        flexDirection: 'column',
    },
    selectBox: {
        width: "100%",
        height: '100%',
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
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
        borderRadius: 16,
        backgroundColor: "#fff",
        border: "1px solid #E5E7EB",
        overflow: "hidden",
    },
    option: {
        padding: 14,
        cursor: "pointer",
        borderBottom: "1px solid #F1F1F1",
    },
    house_name: {
        fontSize: 18,
        opacity: 0.5,
        fontWeight: 'bold',
    },

    device_name: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    timestamp: {
        fontSize: 14,
        opacity: 0.7,
    }
}
