const { Telegraf } = require('telegraf');
const admin = require("firebase-admin");
const axios = require("axios");
const serviceAccount = require("./serviceAccount.json");

// Khoi tao Firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://adr-8poll-default-rtdb.firebaseio.com"
});

const db = admin.database();
const bot = new Telegraf('8419760931:AAFwUzvEaDbobW61aBPahPrcfY164pVY2bU');

// Dung API Moi Nhat 68d53e...
const API_LINK4M = "68d53ecac8e8b304247bdb2d"; 
const MY_WEB = "https://lenguyen1933374.github.io/getkey/"; 

bot.command('getkey', async (ctx) => {
  try {
    const newKey = "MOD" + Math.random().toString(36).substring(2, 7).toUpperCase();
    
    // Luu database
    await db.ref("Free_Keys/" + newKey).set({
      status: "unused",
      type: "24h",
      created_at: Date.now()
    });

    // Goi Link4M
    const destination = `${MY_WEB}?key=${newKey}`;
    const apiUrl = `https://link4m.co/api-token?api=${API_LINK4M}&url=${destination}`;
    const response = await axios.get(apiUrl);

    if (response.data && response.data.shortenedUrl) {
      await ctx.reply("✅ KEY CỦA MÀY ĐÃ SẴN SÀNG:\n\n" + response.data.shortenedUrl);
    } else {
      ctx.reply("Link4M bao loi: " + (response.data.message || "Sai API Token"));
    }
  } catch (e) {
    ctx.reply("Bot loi ket noi roi!");
  }
});

bot.launch().then(() => {
  console.log("DA CHAY VOI API: " + API_LINK4M);
});
