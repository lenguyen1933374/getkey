const { Telegraf } = require('telegraf');
const admin = require("firebase-admin");
const axios = require("axios");
const serviceAccount = require("./serviceAccount.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://adr-8poll-default-rtdb.firebaseio.com"
});

const db = admin.database();
const bot = new Telegraf('8419760931:AAFwUzvEaDbobW61aBPahPrcfY164pVY2bU');
const API_LINK4M = "68d3ec91f1e47945eb523749"; 
const MY_WEB = "https://lenguyen1933374.github.io/getkey/"; 

bot.command('getkey', async (ctx) => {
  try {
    // Key sạch, không ký tự đặc biệt
    const newKey = "NGUYENMOD" + Math.random().toString(36).substring(2, 8).toUpperCase();
    
    await db.ref("Free_Keys/" + newKey).set({
      status: "unused", type: "24h", hwid: "", created_at: Date.now()
    });

    const destination = `${MY_WEB}?key=${newKey}`;
    const response = await axios.get(`https://link4m.co/api-token?api=${API_LINK4M}&url=${destination}`);
    
    // Kiểm tra xem Link4M có trả về link không
    if (response.data && response.data.shortenedUrl) {
      const shortUrl = response.data.shortenedUrl;
      // Gửi tin nhắn dạng văn bản thuần, link sẽ tự động xanh lè
      await ctx.reply("Mã Key 24H: " + newKey + "\n\n👉 LINK VƯỢT ĐỂ LẤY KEY ĐÂY:\n" + shortUrl);
    } else {
      ctx.reply("Lỗi: Link4M không trả về link. Mày xem lại mã API Link4M hoặc số dư bên đó nhé!");
    }
  } catch (e) {
    console.log("Lỗi Bot:", e);
    ctx.reply("Hệ thống bận rồi mày ơi!");
  }
});

bot.launch().then(() => {
  console.log("Bot NguyenMod đang hoạt động rực rỡ...");
}).catch((err) => {
  console.error("Lỗi khởi động bot:", err);
});
