const { Telegraf } = require('telegraf');
const admin = require("firebase-admin");
const axios = require("axios");
const serviceAccount = require("./serviceAccount.json");

// Khởi tạo Firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://adr-8poll-default-rtdb.firebaseio.com"
});

const db = admin.database();
const bot = new Telegraf('8419760931:AAFwUzvEaDbobW61aBPahPrcfY164pVY2bU');
const API_LINK4M = "68d3ec91f1e47945eb523749"; 
const MY_WEB = "https://lenguyen1933374.github.io/getkey/"; 

// Lệnh /getkey đồng nhất
bot.command('getkey', async (ctx) => {
  try {
    // Tạo Key sạch không dấu gạch ngang
    const newKey = "NGUYENMOD" + Math.random().toString(36).substring(2, 8).toUpperCase();
    
    await db.ref("Free_Keys/" + newKey).set({
      status: "unused", 
      type: "24h", 
      hwid: "", 
      created_at: Date.now()
    });

    const destination = MY_WEB + "?key=" + newKey;
    const response = await axios.get("https://link4m.co/api-token?api=" + API_LINK4M + "&url=" + destination);
    
    if (response.data && response.data.shortenedUrl) {
      const shortUrl = response.data.shortenedUrl;
      // Gửi văn bản thuần, link sẽ tự động xanh lè trên Telegram
      await ctx.reply("Mã Key 24H của mày đã sẵn sàng!\n\n👉 Link vượt để lấy key:\n" + shortUrl);
    } else {
      ctx.reply("Lỗi: Link4M không trả về link. Kiểm tra lại API Key Link4M của mày!");
    }

  } catch (e) {
    console.log("Lỗi: ", e);
    ctx.reply("Hệ thống bận, lỗi kết nối rồi mày ơi!");
  }
});

bot.launch().then(() => {
  console.log("-----------------------------------------");
  console.log("Bot NguyenMod đang hoạt động rực rỡ...");
  console.log("Dùng lệnh /getkey để test nhé!");
  console.log("-----------------------------------------");
});
