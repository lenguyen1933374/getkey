bot.command('getkey', async (ctx) => {
  try {
    const newKey = "NGUYENMOD-" + Math.random().toString(36).substring(2, 8).toUpperCase();
    await db.ref("Free_Keys/" + newKey).set({
      status: "unused", type: "24h", hwid: "", created_at: Date.now()
    });

    const destination = `${MY_WEB}?key=${newKey}`;
    const response = await axios.get(`https://link4m.co/api-token?api=${API_LINK4M}&url=${destination}`);
    
    // Cách này gửi link trực tiếp, không sợ lỗi định dạng
    const shortUrl = response.data.shortenedUrl;
    await ctx.reply(`Mã Key 24H của mày đã sẵn sàng!\n\n👉 BẤM VÀO ĐÂY ĐỂ VƯỢT LINK LẤY KEY: ${shortUrl}`);

  } catch (e) {
    console.log(e);
    ctx.reply("Hệ thống bận hoặc lỗi API Link4M rồi mày ơi!");
  }
});
