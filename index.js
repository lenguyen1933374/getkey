const { Telegraf } = require('telegraf');
const admin = require("firebase-admin");
const axios = require("axios");
const serviceAccount = require("./serviceAccount.json");

// 1. Khởi tạo Firebase
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://adr-8poll-default-rtdb.firebaseio.com"
  });
}

const db = admin.database();

// 2. Token mới mày vừa cấp
const bot = new Telegraf('8419760931:AAGM0ibITMWc5_V91_VFDwVYDSvi2NnipoE');

// 3. API Link4M (Dùng mã 68d3ec91... chuẩn của mày)
const API_LINK4M = "68d3ec91f1e47945eb523749"; 
const MY_WEB = "https://lenguyen1933374.github.io/getkey/"; 

bot.command('getkey', async (ctx) => {
  try {
    // Tạo Key ngẫu nhiên
    const newKey = "MOD" + Math.random().toString(36).substring(2, 7).toUpperCase();
    
    // Lưu vào Firebase
    await db.ref("Free_Keys/" + newKey).set({
      status: "unused",
      type: "24h",
      created_at: Date.now()
    });

    const destination = `${MY_WEB}?key=${newKey}`;
    
    // Gọi Link4M theo định dạng rút gọn API chuẩn
    const apiUrl = `https://link4m.co/api-token?api=${API_LINK4M}&url=${encodeURIComponent(destination)}`;
    
    const response = await axios.get(apiUrl);

    if (response.data && response.data.shortenedUrl) {
      // Gửi link xanh lè
      await ctx.reply("✅ KEY CỦA MÀY ĐÃ SẴN SÀNG:\n\n" + response.data.shortenedUrl);
    } else {
      // Nếu Link4M trả về lỗi, báo luôn mã lỗi cho dễ check
      ctx.reply("Link4M báo lỗi: " + (response.data.message || "Kiểm tra lại API Token trên web"));
    }

  } catch (e) {
    console.log("Lỗi Bot:", e.message);
    ctx.reply("Bot không kết nối được Link4M hoặc Database!");
  }
});

// Chạy Bot
bot.launch().then(() => {
  console.log("BOT ĐÃ SỐNG LẠI VỚI TOKEN MỚI!");
  console.log("Dùng lệnh /getkey để hưởng thụ nhé mày.");
}).catch((err) => {
  console.error("Lỗi khởi động:", err);
});
