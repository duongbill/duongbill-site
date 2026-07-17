import { NextResponse } from 'next/server';

// Utility to escape HTML special characters to prevent Telegram formatting crashes
const escapeHtml = (unsafe) => {
  return (unsafe || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
};

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, message, clientInfo } = body;

    // Validate inputs - only message is strictly required now
    if (!message || !message.trim()) {
      return NextResponse.json(
        { error: 'Vui lòng điền nội dung tin nhắn.' },
        { status: 400 }
      );
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    // Check env configuration
    if (!botToken || !chatId || chatId === 'YOUR_TELEGRAM_CHAT_ID') {
      console.error('Telegram configurations are missing or not set in env variables.');
      return NextResponse.json(
        { error: 'Cấu hình Server lỗi. Vui lòng kiểm tra lại biến môi trường Telegram.' },
        { status: 500 }
      );
    }

    // 1. Get location & network info from Vercel headers
    const ip = request.headers.get('x-forwarded-for') || 'Unknown';
    const city = request.headers.get('x-vercel-ip-city') || 'Unknown';
    const region = request.headers.get('x-vercel-ip-country-region') || 'Unknown';
    const country = request.headers.get('x-vercel-ip-country') || 'Unknown';
    const latitude = request.headers.get('x-vercel-ip-latitude') || 'Unknown';
    const longitude = request.headers.get('x-vercel-ip-longitude') || 'Unknown';
    const timezone = request.headers.get('x-vercel-ip-timezone') || 'Unknown';

    // 2. Get device & software info from headers
    const userAgent = request.headers.get('user-agent') || 'Unknown';
    const acceptLanguage = request.headers.get('accept-language') || 'Unknown';

    // Helper to parse OS & Browser from User-Agent
    const parseUserAgent = (ua) => {
      if (!ua) return 'Unknown';
      let os = 'Unknown OS';
      if (ua.includes('Windows')) os = 'Windows';
      else if (ua.includes('Macintosh') || ua.includes('Mac OS')) os = 'macOS';
      else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';
      else if (ua.includes('Android')) os = 'Android';
      else if (ua.includes('Linux')) os = 'Linux';

      let browser = 'Unknown Browser';
      if (ua.includes('Chrome') && !ua.includes('Chromium') && !ua.includes('Edg') && !ua.includes('Brave')) browser = 'Chrome';
      else if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'Safari';
      else if (ua.includes('Firefox')) browser = 'Firefox';
      else if (ua.includes('Edg')) browser = 'Edge';
      else if (ua.includes('Brave')) browser = 'Brave';

      return `${os} / ${browser}`;
    };

    const displayName = name && name.trim() ? name : 'Ẩn danh';

    // Format the message for Telegram using HTML formatting
    const text = `<b>📬 Tin nhắn liên hệ mới từ Website</b>\n\n` +
                 `👤 <b>Họ tên:</b> ${escapeHtml(displayName)}\n` +
                 `📝 <b>Nội dung tin nhắn:</b>\n<i>${escapeHtml(message)}</i>\n\n` +
                 `🌐 <b>Thông tin Vị trí & Mạng:</b>\n` +
                 `• <b>IP:</b> <code>${escapeHtml(ip.split(',')[0].trim())}</code>\n` +
                 `• <b>Địa điểm:</b> ${escapeHtml(city)}, ${escapeHtml(region)}, ${escapeHtml(country)}\n` +
                 `• <b>Tọa độ:</b> <code>${escapeHtml(latitude)}, ${escapeHtml(longitude)}</code>\n` +
                 `• <b>Múi giờ:</b> ${escapeHtml(timezone)}\n\n` +
                 `💻 <b>Thông tin Thiết bị:</b>\n` +
                 `• <b>Thiết bị/Trình duyệt:</b> ${escapeHtml(parseUserAgent(userAgent))}\n` +
                 `• <b>Ngôn ngữ:</b> <code>${escapeHtml(acceptLanguage.split(',')[0].trim())}</code>\n` +
                 `• <b>Độ phân giải:</b> <code>${escapeHtml(clientInfo?.screenResolution || 'Unknown')}</code>\n\n` +
                 `⏱️ <b>Trải nghiệm & Hành vi:</b>\n` +
                 `• <b>Thời gian gửi:</b> <code>${escapeHtml(clientInfo?.submitTime || 'Unknown')}</code>\n` +
                 `• <b>Trang nguồn:</b> <a href="${escapeHtml(clientInfo?.currentPage || '#')}">Link gửi</a>`;

    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: 'HTML',
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Telegram sendMessage API error:', errorText);
      return NextResponse.json(
        { error: 'Không thể gửi tin nhắn đến Telegram. Vui lòng thử lại sau.' },
        { status: response.status }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in contact serverless route:', error);
    return NextResponse.json(
      { error: 'Lỗi hệ thống nội bộ. Vui lòng thử lại sau.' },
      { status: 500 }
    );
  }
}
