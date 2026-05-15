'use client';
type Props = {
    label: string;
    onClick: () => void;
    active: boolean;
};
import type { CSSProperties } from 'react';

export default function Button({ label, onClick, active }: Props) {
    return (
        <button 
        onClick={onClick}
        style={{
            ...styles.button,
            backgroundColor: active ? "#1976D2" : "#E3F2FD",
            color: active ? "#fff" : "#000",
        }} >
            {label}
        </button>
    );   
}

const styles: { button: CSSProperties } = {
    button: {
        width: '100%',
        height: 50,
        border: "none",
        borderRadius: 5,
        fontSize: 12,
        fontWeight: 600,
        cursor: "pointer",
        boxShadow: "0 2px 6px rgba(0,0,0,0.15)",

    }
}