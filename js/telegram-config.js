/**
 * Telegram Bot Configuration
 * Hướng dẫn cấu hình:
 * 1. Tạo bot mới với @BotFather trên Telegram
 * 2. Lấy Bot Token từ BotFather
 * 3. Gửi tin nhắn cho bot của bạn
 * 4. Truy cập: https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates
 * 5. Tìm chat.id trong response
 */

const TELEGRAM_CONFIG = {
  // Token bot từ BotFather
  BOT_TOKEN: "8188463035:AAEQtz13139Qsnmb_Gzgb18NU5m2u9VibOM",

  // Chat ID của bạn
  CHAT_ID: "1898063540",

  // URL API Telegram (không cần thay đổi)
  API_URL: "https://api.telegram.org/bot",
};

/**
 * Telegram Notification Service
 */
class TelegramNotification {
  constructor() {
    this.config = TELEGRAM_CONFIG;
    this.init();
  }

  init() {
    this.trackVisitor();
    this.setupContactFormIntegration();
  }

  /**
   * Gửi thông báo khi có người truy cập trang web
   */
  async trackVisitor() {
    try {
      // Lấy thông tin visitor
      const visitorInfo = await this.getVisitorInfo();

      // Tạo message thông báo
      const message = this.formatVisitorMessage(visitorInfo);

      // Gửi thông báo
      await this.sendMessage(message);

      console.log("Visitor notification sent successfully");
    } catch (error) {
      console.error("Error sending visitor notification:", error);
    }
  }

  /**
   * Lấy thông tin visitor chi tiết
   */
  async getVisitorInfo() {
    const now = new Date();
    const userId = this.generateUserId();
    const sessionType = this.getSessionType();

    const info = {
      userId: userId,
      timestamp: now.toLocaleString("vi-VN", {
        timeZone: "Asia/Ho_Chi_Minh",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
      visitTime:
        now.toLocaleTimeString("vi-VN", {
          timeZone: "Asia/Ho_Chi_Minh",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }) +
        " " +
        now.toLocaleDateString("vi-VN", {
          timeZone: "Asia/Ho_Chi_Minh",
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      url: window.location.href,
      referrer: document.referrer || "Direct access",
      screenResolution: `${screen.width}x${screen.height}`,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      sessionType: sessionType,
      device: this.getDeviceType(navigator.userAgent),
      browser: this.getBrowserInfo(navigator.userAgent),
      os: this.getOSInfo(navigator.userAgent),
    };

    // Lấy thông tin IP và location
    try {
      const response = await fetch("https://ipapi.co/json/");
      const locationData = await response.json();
      info.ip = locationData.ip;
      info.country = locationData.country_name;
      info.city = locationData.city;
      info.region = locationData.region;
      info.isp = locationData.org;
      info.countryCode = locationData.country_code;
    } catch (error) {
      console.log("Could not fetch location data:", error);
      // Fallback IP service
      try {
        const fallbackResponse = await fetch(
          "https://api.ipify.org?format=json"
        );
        const fallbackData = await fallbackResponse.json();
        info.ip = fallbackData.ip;
      } catch (fallbackError) {
        info.ip = "Unknown";
      }
    }

    return info;
  }

  /**
   * Tạo User ID duy nhất
   */
  generateUserId() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    return `user_${timestamp}_${random}`;
  }

  /**
   * Xác định session type (New/Returning)
   */
  getSessionType() {
    const lastVisit = localStorage.getItem("lastVisit");
    const now = Date.now();

    if (!lastVisit) {
      localStorage.setItem("lastVisit", now.toString());
      return "New";
    } else {
      localStorage.setItem("lastVisit", now.toString());
      return "Returning";
    }
  }

  /**
   * Format message cho visitor notification với đầy đủ thông tin
   */
  formatVisitorMessage(info) {
    let message = `🌐 *Website Visitor Alert*\n\n`;

    // User Information
    message += `👤 *User ID:* ${info.userId}\n`;
    message += `🌐 *IP Address:* ${info.ip || "Unknown"}\n`;
    message += `📱 *Device:* ${info.device}\n`;
    message += `🌐 *Browser:* ${info.browser}\n`;
    message += `💻 *OS:* ${info.os}\n`;
    message += `🔄 *Session:* ${info.sessionType}\n`;
    message += `⏰ *Visit Time:* ${info.visitTime}\n`;
    message += `📄 *Page:* ${info.url}\n`;

    if (info.referrer && info.referrer !== "Direct access") {
      message += `🔗 *Referrer:* ${info.referrer}\n`;
    } else {
      message += `🔗 *Referrer:* Direct access\n`;
    }

    // Location Information
    if (info.country && info.city) {
      message += `📍 *Location:* ${info.city}, ${info.country}\n`;
    }

    if (info.region) {
      message += `🗺️ *Region:* ${info.region}\n`;
    }

    if (info.isp) {
      message += `🏢 *ISP:* ${info.isp}\n`;
    }

    // Technical Details
    message += `📺 *Screen:* ${info.screenResolution}\n`;
    message += `🖼️ *Viewport:* ${info.viewport}\n`;
    message += `🌏 *Language:* ${info.language}\n`;
    message += `⏰ *Timezone:* ${info.timezone}\n`;

    // Visitor Statistics
    try {
      const stats = this.getVisitorStats();
      message += `\n📊 *Website Statistics:*\n`;
      message += `📈 *Total Visits:* ${stats.total}\n`;
      message += `📅 *Today's Visits:* ${stats.today}\n`;
      message += `👥 *Unique Visitors:* ${stats.unique}\n`;
    } catch (error) {
      console.log("Could not get visitor stats:", error);
    }

    // User Agent (truncated for readability)
    const shortUserAgent =
      info.userAgent.length > 100
        ? info.userAgent.substring(0, 100) + "..."
        : info.userAgent;
    message += `\n🔧 *User Agent:* ${shortUserAgent}`;

    return message;
  }

  /**
   * Lấy thống kê visitor
   */
  getVisitorStats() {
    const totalVisits = localStorage.getItem("totalVisits") || "0";
    const todayVisits = localStorage.getItem("todayVisits") || "0";
    const uniqueIPs = JSON.parse(localStorage.getItem("uniqueIPs") || "[]");

    return {
      total: totalVisits,
      today: todayVisits,
      unique: uniqueIPs.length,
    };
  }

  /**
   * Xác định loại thiết bị chi tiết
   */
  getDeviceType(userAgent) {
    // Mobile devices
    if (/iPhone/.test(userAgent)) {
      const match = userAgent.match(/iPhone(\d+,\d+)/);
      if (match) {
        const model = this.getIPhoneModel(match[1]);
        return `iPhone (${model})`;
      }
      return "iPhone";
    }

    if (/iPad/.test(userAgent)) {
      return "iPad";
    }

    if (/Android/.test(userAgent)) {
      // Try to extract Android device info
      const match = userAgent.match(/Android\s([^;]+)/);
      if (match) {
        return `Android ${match[1]}`;
      }
      return "Android";
    }

    // Other mobile
    if (/Mobile|webOS|BlackBerry|IEMobile|Opera Mini/.test(userAgent)) {
      return "Mobile";
    }

    // Desktop/Laptop
    if (/Macintosh/.test(userAgent)) {
      return "Mac";
    }

    if (/Windows/.test(userAgent)) {
      return "Windows PC";
    }

    if (/Linux/.test(userAgent)) {
      return "Linux";
    }

    return "Desktop";
  }

  /**
   * Lấy model iPhone từ identifier
   */
  getIPhoneModel(identifier) {
    const models = {
      "12,1": "iPhone 11",
      "12,3": "iPhone 11 Pro",
      "12,5": "iPhone 11 Pro Max",
      "13,1": "iPhone 12 mini",
      "13,2": "iPhone 12",
      "13,3": "iPhone 12 Pro",
      "13,4": "iPhone 12 Pro Max",
      "14,4": "iPhone 13 mini",
      "14,5": "iPhone 13",
      "14,2": "iPhone 13 Pro",
      "14,3": "iPhone 13 Pro Max",
      "14,7": "iPhone 14",
      "14,8": "iPhone 14 Plus",
      "15,2": "iPhone 14 Pro",
      "15,3": "iPhone 14 Pro Max",
      "15,4": "iPhone 15",
      "15,5": "iPhone 15 Plus",
      "16,1": "iPhone 15 Pro",
      "16,2": "iPhone 15 Pro Max",
    };
    return models[identifier] || identifier;
  }

  /**
   * Lấy thông tin trình duyệt chi tiết
   */
  getBrowserInfo(userAgent) {
    // Instagram in-app browser
    if (/Instagram/.test(userAgent)) {
      const match = userAgent.match(/Instagram\s([\d.]+)/);
      return match ? `Instagram ${match[1]}` : "Instagram";
    }

    // Facebook in-app browser
    if (/FBAN|FBAV/.test(userAgent)) {
      return "Facebook";
    }

    // Chrome
    if (/Chrome/.test(userAgent) && !/Edge|OPR/.test(userAgent)) {
      const match = userAgent.match(/Chrome\/([\d.]+)/);
      return match ? `Chrome ${match[1]}` : "Chrome";
    }

    // Edge
    if (/Edg/.test(userAgent)) {
      const match = userAgent.match(/Edg\/([\d.]+)/);
      return match ? `Edge ${match[1]}` : "Edge";
    }

    // Firefox
    if (/Firefox/.test(userAgent)) {
      const match = userAgent.match(/Firefox\/([\d.]+)/);
      return match ? `Firefox ${match[1]}` : "Firefox";
    }

    // Safari
    if (/Safari/.test(userAgent) && !/Chrome/.test(userAgent)) {
      const match = userAgent.match(/Version\/([\d.]+)/);
      return match ? `Safari ${match[1]}` : "Safari";
    }

    // Opera
    if (/OPR/.test(userAgent)) {
      const match = userAgent.match(/OPR\/([\d.]+)/);
      return match ? `Opera ${match[1]}` : "Opera";
    }

    return "Unknown";
  }

  /**
   * Lấy thông tin hệ điều hành chi tiết
   */
  getOSInfo(userAgent) {
    // iOS
    if (/iPhone OS|iOS/.test(userAgent)) {
      const match = userAgent.match(/OS\s([\d_]+)/);
      if (match) {
        const version = match[1].replace(/_/g, ".");
        return `iOS ${version}`;
      }
      return "iOS";
    }

    // macOS
    if (/Mac OS X/.test(userAgent)) {
      const match = userAgent.match(/Mac OS X\s([\d_]+)/);
      if (match) {
        const version = match[1].replace(/_/g, ".");
        return `macOS ${version}`;
      }
      return "macOS";
    }

    // Android
    if (/Android/.test(userAgent)) {
      const match = userAgent.match(/Android\s([\d.]+)/);
      return match ? `Android ${match[1]}` : "Android";
    }

    // Windows
    if (/Windows/.test(userAgent)) {
      if (/Windows NT 10/.test(userAgent)) return "Windows 10/11";
      if (/Windows NT 6.3/.test(userAgent)) return "Windows 8.1";
      if (/Windows NT 6.2/.test(userAgent)) return "Windows 8";
      if (/Windows NT 6.1/.test(userAgent)) return "Windows 7";
      return "Windows";
    }

    // Linux
    if (/Linux/.test(userAgent)) {
      return "Linux";
    }

    return "Unknown";
  }

  /**
   * Gửi message qua Telegram
   */
  async sendMessage(message) {
    const url = `${this.config.API_URL}${this.config.BOT_TOKEN}/sendMessage`;

    const payload = {
      chat_id: this.config.CHAT_ID,
      text: message,
      parse_mode: "Markdown",
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

  /**
   * Gửi thông báo khi có tin nhắn từ contact form với đầy đủ thông tin
   */
  async sendContactMessage(message, additionalInfo = {}) {
    try {
      const userId = this.generateUserId();

      // Lấy thông tin visitor hiện tại
      const visitorInfo = await this.getVisitorInfo();

      let telegramMessage = `💌 *New Contact Message*\n\n`;

      // Message content
      telegramMessage += `📝 *Message:*\n"${message}"\n\n`;

      // User Information
      telegramMessage += `👤 *User ID:* ${userId}\n`;
      telegramMessage += `🌐 *IP Address:* ${
        visitorInfo.ip || additionalInfo.ip || "Unknown"
      }\n`;
      telegramMessage += `� *Device:* ${visitorInfo.device}\n`;
      telegramMessage += `🌐 *Browser:* ${visitorInfo.browser}\n`;
      telegramMessage += `💻 *OS:* ${visitorInfo.os}\n`;
      telegramMessage += `⏰ *Submit Time:* ${visitorInfo.visitTime}\n`;
      telegramMessage += `📄 *Page:* ${visitorInfo.url}\n`;

      if (visitorInfo.referrer && visitorInfo.referrer !== "Direct access") {
        telegramMessage += `🔗 *Referrer:* ${visitorInfo.referrer}\n`;
      }

      // Location Information
      if (visitorInfo.country && visitorInfo.city) {
        telegramMessage += `📍 *Location:* ${visitorInfo.city}, ${visitorInfo.country}\n`;
      }

      if (visitorInfo.region) {
        telegramMessage += `🗺️ *Region:* ${visitorInfo.region}\n`;
      }

      if (visitorInfo.isp) {
        telegramMessage += `🏢 *ISP:* ${visitorInfo.isp}\n`;
      }

      // Technical Details
      telegramMessage += `📺 *Screen:* ${visitorInfo.screenResolution}\n`;
      telegramMessage += `�️ *Viewport:* ${visitorInfo.viewport}\n`;
      telegramMessage += `� *Language:* ${visitorInfo.language}\n`;
      telegramMessage += `⏰ *Timezone:* ${visitorInfo.timezone}`;

      await this.sendMessage(telegramMessage);
      console.log("Contact message notification sent successfully");
    } catch (error) {
      console.error("Error sending contact message notification:", error);
    }
  }

  /**
   * Setup integration với contact form
   */
  setupContactFormIntegration() {
    // Lắng nghe sự kiện submit form
    document.addEventListener("DOMContentLoaded", () => {
      const contactForm = document.getElementById("contactForm");
      if (contactForm) {
        contactForm.addEventListener("submit", async () => {
          const messageInput = document.getElementById("userMessage");
          if (messageInput && messageInput.value.trim()) {
            // Gửi thông báo Telegram
            await this.sendContactMessage(messageInput.value.trim(), {
              userAgent: navigator.userAgent,
              ip: await this.getCurrentIP(),
            });
          }
        });
      }
    });
  }

  /**
   * Lấy IP hiện tại
   */
  async getCurrentIP() {
    try {
      const response = await fetch("https://api.ipify.org?format=json");
      const data = await response.json();
      return data.ip;
    } catch (error) {
      return "Unknown";
    }
  }
}

// Export để sử dụng trong script khác
window.TELEGRAM_CONFIG = TELEGRAM_CONFIG;
window.TelegramNotification = TelegramNotification;

/**
 * Visitor Statistics Manager
 */
class VisitorStats {
  constructor() {
    this.updateStats();
  }

  updateStats() {
    // Cập nhật số lượng visitor
    const totalVisits =
      parseInt(localStorage.getItem("totalVisits") || "0") + 1;
    localStorage.setItem("totalVisits", totalVisits.toString());

    // Cập nhật visitor hôm nay
    const today = new Date().toDateString();
    const todayVisits = localStorage.getItem("todayVisits");
    const lastVisitDate = localStorage.getItem("lastVisitDate");

    if (lastVisitDate !== today) {
      // Ngày mới, reset counter
      localStorage.setItem("todayVisits", "1");
      localStorage.setItem("lastVisitDate", today);
    } else {
      // Cùng ngày, tăng counter
      const todayCount = parseInt(todayVisits || "0") + 1;
      localStorage.setItem("todayVisits", todayCount.toString());
    }

    // Cập nhật unique visitors (dựa trên IP)
    this.updateUniqueVisitors();
  }

  async updateUniqueVisitors() {
    try {
      const response = await fetch("https://api.ipify.org?format=json");
      const data = await response.json();
      const currentIP = data.ip;

      const uniqueIPs = JSON.parse(localStorage.getItem("uniqueIPs") || "[]");
      if (!uniqueIPs.includes(currentIP)) {
        uniqueIPs.push(currentIP);
        localStorage.setItem("uniqueIPs", JSON.stringify(uniqueIPs));
      }
    } catch (error) {
      console.log("Could not update unique visitors:", error);
    }
  }

  getStats() {
    const totalVisits = localStorage.getItem("totalVisits") || "0";
    const todayVisits = localStorage.getItem("todayVisits") || "0";
    const uniqueIPs = JSON.parse(localStorage.getItem("uniqueIPs") || "[]");

    return {
      total: totalVisits,
      today: todayVisits,
      unique: uniqueIPs.length,
    };
  }
}

// Export classes
window.VisitorStats = VisitorStats;

// Khởi tạo service khi trang load
document.addEventListener("DOMContentLoaded", () => {
  // Delay một chút để trang load hoàn toàn
  setTimeout(() => {
    new TelegramNotification();
    new VisitorStats();
  }, 2000);
});
