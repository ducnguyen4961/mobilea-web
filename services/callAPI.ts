import {Gettimenow} from "./timenow"
const general_API = "https://srwqda5wre.execute-api.ap-northeast-1.amazonaws.com/version1";


// Gọi API lấy dữ liệu ở trang home
export async function homecallAPI(deviceIds: string[]) {
    try {
        const { start, end } = Gettimenow();

        const response = await fetch(
            `${general_API}/home_page?device_id=${encodeURIComponent(deviceIds.join(","))}&start=${start}&end=${end}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        if (!response.ok) {
            throw new Error("API home_page Error");
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error("fetchSensorData error:", error);
        return null;
    }
}

interface Graph {
    start: string;
    end: string;
    deviceIds: string[]
}
// Gọi API lấy dữ liệu ở trang graph trong 1 ngày
export async function graphcallAPI1day({start, end, deviceIds}: Graph) {
    try {
        const graphRes = await fetch(
            `${general_API}/graph_page/1day?device_id=${encodeURIComponent(deviceIds.join(","))}&start=${start}&end=${end}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        if(!graphRes.ok) {
            throw new Error("API graph_page Error");
        }

        const data = await graphRes.json();
        return data;
    } catch (error) {
        console.error("Graph page error:", error);
        return null;
    }
}

// Gọi API để lấy dữ liệu trong 1 tuần hoặc 1 tháng
export async function graphcallAPI1weekormonth({start, end, deviceIds}: Graph) {
    try {
        const graphRes = await fetch(
            `${general_API}/graph_page/1week?device_id=${encodeURIComponent(deviceIds.join(","))}&start=${start}&end=${end}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        if(!graphRes.ok) {
            throw new Error("API graph_page Error");
        }

        const data = await graphRes.json();
        return data;
    } catch (error) {
        console.error("Graph page error:", error);
        return null;
    }
}

// Gọi API để lấy dữ liệu trong khoảng thời gian tùy chỉnh
export async function graphcallAPIcustomize({start, end, deviceIds}: Graph) {
    try {
        const graphRes = await fetch(
            `${general_API}/graph_page/customize?device_id=${encodeURIComponent(deviceIds.join(","))}&start=${start}&end=${end}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        if(!graphRes.ok) {
            throw new Error("API graph_page Error");
        }

        const data = await graphRes.json();
        return data;
    } catch (error) {
        console.error("Graph page error:", error);
        return null;
    }
}


