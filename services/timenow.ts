export function Gettimenow() {
    const now = new Date();

    const end = now.toLocaleString("sv-SE", {timeZone: "Asia/Tokyo",}).replace(" ", "T");
    
    const start = new Date(now.getTime() - 5 * 60 * 1000).toLocaleString("sv-SE", {timeZone: "Asia/Tokyo",}).replace(" ", "T");
    return {start,end,};
}