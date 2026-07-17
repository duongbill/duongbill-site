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
    const { name, email, message } = body;

    // Validate inputs
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Vui lòng điền đầy đủ các thông tin yêu cầu.' },
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

    // Format the message for Telegram using HTML formatting (safer than Markdown)
    const text = `<b>📬 Tin nhắn liên hệ mới từ Website</b>\n\n` +
                 `👤 <b>Họ tên:</b> ${escapeHtml(name)}\n` +
                 `✉️ <b>Email:</b> ${escapeHtml(email)}\n\n` +
                 `📝 <b>Nội dung tin nhắn:</b>\n${escapeHtml(message)}`;

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
