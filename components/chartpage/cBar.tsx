'use client';

type Props = {
    label: string;
    onClick: () => void;
}
import type { CSSProperties } from 'react';

export default function Bar({ label, onClick }: Props ) {
    return (
        <div style={styles.belowbar}>
            <div style={styles.grid}>
                <button onClick={onClick} style={{...styles.button,height: "100%"}}>
                    {`1 ${label} ago`}
                </button>
                <button onClick={onClick} style={{...styles.button,height: "100%"}}>
                    {`Now`}
                </button>
                <button onClick={onClick} style={{...styles.button, height: "100%"}}>
                    {`1 ${label} later`}
                </button>
            </div>
        </div>
    )
};

const styles:{
    belowbar: CSSProperties;
    grid: CSSProperties;
    button: CSSProperties;
} = {
    belowbar: {
        position: 'fixed', // giữ thanh bar ở vị trí cố định
        bottom: 0, // ghim thanh bar vào mép dưới màn hình
        left: 0, // căn sát mép trái màn hình
        width: '100%', //  chiếm toàn bộ chiều ngang màn hình
        height: 60, 
        backgroundColor: '#d4cd88',
        borderTop: '2px solid #ddd', // tạo đường viền phía dưới để phân tách nội dung
        display: 'flex', // sử dụng flexbox để căn chỉnh nội dung bên trong
        alignItems: 'center', // căn nội dung theo chiều dọc -> nằm giữa thanh bar
        zIndex: 100, // đảm bảo thanh bar hiển thị trên các phần tử khác (nếu có)
    },

    grid: {
        width: '100%', // chiếm 50% chiều ngang màn hình
        height: '100%', // chiếm toàn bộ chiều cao của thanh bar
        display: 'flex',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        fontSize: 16,
        flexDirection: 'row',
    }, 
    button: {
        width: '10%',
        border: "none",        
        borderRadius: 10,
        background: "linear-gradient(135deg, #4A90E2, #357ABD)",
        color: "white",
        fontSize: 15,
        fontWeight: 600,
        cursor: "pointer",
        transition: "all 0.2s ease",
        boxShadow: "0 4px 12px rgba(74,144,226,0.35)",
    },
}
