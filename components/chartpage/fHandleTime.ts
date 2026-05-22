// Hàm xử lý thời gian để gửi xuống cho Bottom Bar
interface TimesFunction {
  offset: number;
  unit: string;
  start?: string;
  end?: string;
}

type TimeResult = {
  startresult: string;
  endresult: string;
  diff: number;
};

export default function handleTime({offset, unit, start, end}: TimesFunction): TimeResult {

    // lấy thời gian trên máy local, chứa thời gian thứ ngày tháng
    const now = new Date();

    // chuyển về vùng của Nhật, 2026-05-18T11:56:00
    const TokyoArea = now.toLocaleString("sv-SE", {timeZone: "Asia/Tokyo",}).replace(" ", "T");

    // Nếu người dùng chọn đơn vị là ngày
    if(unit === "day") {
      const target = new Date(TokyoArea); // Date Mon May 18 2026 11:56:00 GMT+0900 (Japan Standard Time)
      // phải trừ đi trước rồi mới được format lại dạng dữ liệu
      target.setDate(target.getDate() + offset);
      // chuyển lại dạng dữ liệu
      const formatted = target.toLocaleString("sv-SE", {timeZone: "Asia/Tokyo",}).replace(" ", "T");
      const dateOnly = formatted.slice(0,10);
      // đầu ngày
      const startofDay = `${dateOnly}T00:00:00`;
      // cuối ngày
      const endofDay = `${dateOnly}T23:59:59`;
      return {startresult: startofDay, endresult: endofDay, diff: 1}
    };

    // Nếu người dùng chọn đơn vị là tuần
    if(unit === "week") {
      const target = new Date(TokyoArea); // Output dạng Tue May 19 2026 14:30:00
      // Xác định xem hôm nay là thứ mấy
      const today = target.getDay(); // 0...6, chủ nhật là 0, thứ 2 là 1

      // giờ phải tìm ra thời gian bắt đầu của tuần
      const startofWeek = new Date(target);
      startofWeek.setDate(startofWeek.getDate() - today + offset*7); // Output: Date Sun May 24 2026 14:30:00 JST
      //  set thời gian về 00:00:00
      startofWeek.setHours(0,0,0,0);
      
      // tìm tiếp thời gian kết thúc tuần
      const endofWeek = new Date(startofWeek);
      endofWeek.setDate(endofWeek.getDate() + 6);
      endofWeek.setHours(23,59,59,999);

      // lúc này các dạng dữ liệu bắt đầu và kết thúc đều ở dạng Date Sun May 10 2026 00:00:00,
      // format lại dạng chuẩn

      const startOftheWeek = startofWeek.toLocaleString("sv-SE", {timeZone: "Asia/Tokyo",}).replace(" ", "T");
      const endOftheWeek = endofWeek.toLocaleString("sv-SE", {timeZone: "Asia/Tokyo",}).replace(" ", "T");

      // thêm đuôi #30min vào vì 1 tuần thì cần query loại dữ liệu 30 phút
      const finalstart = `${startOftheWeek}`;
      const finalend = `${endOftheWeek}`;

      return {
        startresult: finalstart, 
        endresult: finalend,
        diff: 7
      }
    };

    // Nếu người dùng chọn đơn vị là tháng
    if(unit === "month") {
      const target = new Date(TokyoArea);
      // tìm ngày hôm nay
      const today = target.getDate();
      // tìm ngày mùng 1 của tháng này
      const currentMonth = new Date(target);
      currentMonth.setDate(currentMonth.getDate() - today + 1);

      // ngày bắt đầu của tháng trước
      const startMonth = new Date(currentMonth);
      startMonth.setMonth(startMonth.getMonth() + offset) // Output Sunday April 1 2026 18:50:53
      startMonth.setHours(0,0,0,0); // set thời gian về 00h00p00

      // ngày bắt đầu của tháng sau đó
      const endMonth = new Date(startMonth);
      endMonth.setMonth(endMonth.getMonth() + 1); // ngày đầu tiên của tháng sau
      endMonth.setDate(endMonth.getDate() - 1); // trừ đi là ra ngày cuối cùng của tháng đó
      endMonth.setHours(23,59,59,999)

      // Format lại dữ liệu
      const startofMonth = startMonth.toLocaleString("sv-SE", {timeZone: "Asia/Tokyo",}).replace(" ", "T");
      const endofMonth = endMonth.toLocaleString("sv-SE", {timeZone: "Asia/Tokyo",}).replace(" ", "T");
      return {
        startresult: startofMonth,
        endresult: endofMonth,
        diff: 31
      };
    };
    
    // Nếu người dùng chọn tùy chỉnh
    if (unit === "free") {
        if (!start || !end) {throw new Error("Missing start or end");}
        const start_target = (new Date(start)) // ra thứ ngày tháng năm, 
        const end_target = (new Date(end))

        const diffMs = end_target.getTime() - start_target.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))+1;
        
        return {
            startresult: start,
            endresult: end,
            diff: diffDays
        }
    }
    throw new Error("Invalid unit");
  }