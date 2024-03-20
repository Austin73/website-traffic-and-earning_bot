const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");
require("dotenv").config();

// Replace 'YOUR_TELEGRAM_BOT_TOKEN' with your actual bot token obtained from BotFather
const bot = new TelegramBot(process.env.TELEGRAM_BOT_API_KEY, {
  polling: true,
});

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(
    chatId,
    "Welcome to Website Info Bot! Send me a website URL and I will provide you with traffic details and earnings."
  );
});

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const websiteUrl = msg.text.trim();

  try {
    // Retrieve website traffic details using SimilarWeb API
    const trafficResponse = await axios.get(
      `https://api.similarweb.com/v1/website/${websiteUrl}/total-traffic-and-engagement?api_key=${process.env.SIMILAR_WEB_API_KEY}`
    );
    const trafficData = trafficResponse.data;

    // Retrieve website earnings data using your preferred API
    // Example: const earningsResponse = await axios.get(`YOUR_EARNINGS_API_ENDPOINT`);

    // Format the response
    let responseText = `Traffic details for ${websiteUrl}:\n`;
    responseText += `Total Visits: ${trafficData.visits}\n`;
    responseText += `Average Visit Duration: ${trafficData.average_visit_duration}\n`;

    // Send the response back to the user
    bot.sendMessage(chatId, responseText);
  } catch (error) {
    console.error("Error:", error);
    bot.sendMessage(
      chatId,
      "An error occurred while processing your request. Please try again later."
    );
  }
});
