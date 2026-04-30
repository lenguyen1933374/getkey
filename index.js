bot.command('getkey', async (ctx) => {
  try {
    // Tạo key thuần chữ và số, không chứa ký tự đặc biệt
    const newKey = "NGUYENMOD" + Math.random().toString(36).substring(2, 8).toUpperCase();
    
    await db.ref("Free_Keys/" + newKey).set({
      status: "unused", 
      type: "24h", 
      hwid: "", 
      created_at: Date.now()
    });

    const destination = `${MY_WEB}?key=${newKey}`;
    const response = await axios.get(`https://link4m.co/api-token?api=${API_LINK4M}&url=${destination}`);
    
    if (response.data && response.data.shortenedUrl) {
      const shortUrl = response.data.shortenedUrl;
      // Gửi tin nhắn thuần túy nhất có thể
      await ctx.reply("Mã Key 24H của mày đã sẵn sàng!\n\n👉 Link lấy key: " + shortUrl);
    } else {
      ctx.reply("Lỗi: Thằng Link4M không nhả link. Kiểm tra lại API_LINK4M trong code!");
    }

  } catch (e) {
    console.log("Lỗi hệ thống: ", e);
    ctx.reply("Hệ thống bận, thử lại sau nhé mày!");
  }
});
