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
// Gọi API lấy dữ liệu ở trang graph với point là 1 phút
export async function graphcallAPI1minute({start, end, deviceIds}: Graph) {
    try {
        const graphRes = await fetch(
            `${general_API}/graph_page/1minute?device_id=${encodeURIComponent(deviceIds.join(","))}&start=${start}&end=${end}`,
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

// Gọi API để lấy dữ liệu với point là 30 phút
export async function graphcallAPI30mins({start, end, deviceIds}: Graph) {
    try {
        const graphRes = await fetch(
            `${general_API}/graph_page/30mins?device_id=${encodeURIComponent(deviceIds.join(","))}&start=${start}&end=${end}`,
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

// Gọi API để lấy dữ liệu với point là 1 giờ
export async function graphcallAPI1hour({start, end, deviceIds}: Graph) {
    try {
        const graphRes = await fetch(
            `${general_API}/graph_page/1hour?device_id=${encodeURIComponent(deviceIds.join(","))}&start=${start}&end=${end}`,
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


// Gọi API để put dữ liệu từ trang register
export async function registercallAPI(params: any[]) {
    try {
        const response = await fetch(`${general_API}/registerpage`, 
            {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    parameters: params
                }
                )
            }
        );
        if (!response.ok) {
            throw new Error("API register_page Error");
        }
        const data = await response.json();
        
        return data;
    } catch (error) {
        console.error("Register API error:", error);
        return null;
    }
}

