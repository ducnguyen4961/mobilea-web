import {Gettimenow} from "./timenow"
const general_API = "https://srwqda5wre.execute-api.ap-northeast-1.amazonaws.com/version1";


// Gọi API lấy dữ liệu ở trang home
export async function homecallAPI(deviceId: string) {
    try {
        const { start, end } = Gettimenow();
        const response = await fetch(
            `${general_API}/home_page?device_id=${deviceId}&start=${start}&end=${end}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        if(!response.ok) {
            throw new Error("API home_page Error");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("fetchSensorData error:", error);
        return null;
    }
}


