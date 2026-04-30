bot.command('getkey', async (ctx) => {
  try {
    // 1. Tạo key thuần chữ/số (không dấu gạch ngang)
    const newKey = "NGUYENMOD" + Math.random().toString(36).substring(2, 8).toUpperCase();
    
    // 2. Lưu vào Firebase
    await db.ref("Free_Keys/" + newKey).set({
      status: "unused", 
      type: "24h", 
      hwid: "", 
      created_at: Date.now()
    });

    // 3. Gọi Link4M để lấy link rút gọn
    const destination = `${MY_WEB}?key=${newKey}`;
    const response = await axios.get(`https://link4m.co/api-token?api=${API_LINK4M}&url=${destination}`);
    
    // 4. Kiểm tra và Gửi link
    if (response.data && response.data.shortenedUrl) {
      const shortUrl = response.data.shortenedUrl;
      // Gửi thẳng link ra, không dùng Markdown
      await ctx.reply("Mã Key 24H của mày đã sẵn sàng!\n\n👉 Link vượt link lấy key: " + shortUrl);
    } else {
      ctx.reply("Lỗi: Link4M không trả về link. Xem lại API_LINK4M nhé!");
    }

  } catch (e) {
    console.log("Lỗi rồi:", e);
    ctx.reply("Hệ thống bận, thử lại sau!");
  }
});
