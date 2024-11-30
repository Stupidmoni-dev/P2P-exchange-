const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

// Replace with your Telegram Bot Token directly
const token = '7680051999:AAEcz8gpil8bzXNXPdShDUlukus0oqXIdyY'; // Replace with your actual token

// Create bot instance
const bot = new TelegramBot(token, { polling: true });

// Log any polling errors
bot.on('polling_error', (error) => {
    console.error('Polling error:', error);
});

// Database simulation (In-memory storage for simplicity)
let users = {};
let trades = [];

// Fetch crypto prices from CoinGecko API
const getPrices = async () => {
    try {
        const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,tether,solana,litecoin,ripple,cardano,polkadot,dogecoin&vs_currencies=usd');
        return response.data;
    } catch (error) {
        console.error('Error fetching prices:', error);
        return null;
    }
};

// Welcome message (Fixed)
bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    const userName = msg.from.first_name;

    console.log(`Received /start command from: ${userName}`);

    // Store user information in database if it's a new user
    if (!users[chatId]) {
        users[chatId] = { name: userName, kyc: false, history: [] };
    }

    const welcomeMessage = `Welcome ${userName} to the Decentralized P2P Crypto Exchange Bot!
    \nUse /help to view all available commands.`;

    bot.sendMessage(chatId, welcomeMessage);
});

// Show help and commands
bot.onText(/\/help/, (msg) => {
    const chatId = msg.chat.id;
    const helpMessage = `
    Available Commands:
    /prices - View current cryptocurrency prices.
    /trade - Start a trade (Buy/Sell).
    /history - View your trade history.
    /support - Reach out to our developer for help or issues.
    /donate - Donate to support the server running costs and the project.
    `;

    bot.sendMessage(chatId, helpMessage);
});

// Show current prices
bot.onText(/\/prices/, async (msg) => {
    const chatId = msg.chat.id;
    const prices = await getPrices();

    if (prices) {
        const priceMessage = `
        Current Prices:
        - BTC: $${prices.bitcoin.usd}
        - ETH: $${prices.ethereum.usd}
        - USDT: $${prices.tether.usd}
        - SOL: $${prices.solana.usd}
        - LTC: $${prices.litecoin.usd}
        - XRP: $${prices.ripple.usd}
        - ADA: $${prices.cardano.usd}
        - DOT: $${prices.polkadot.usd}
        - DOGE: $${prices.dogecoin.usd}
        `;

        bot.sendMessage(chatId, priceMessage);
    } else {
        bot.sendMessage(chatId, 'Unable to fetch prices at the moment. Please try again later.');
    }
});

// Process Buy/Sell commands
bot.onText(/\/trade/, (msg) => {
    const chatId = msg.chat.id;
    const tradeMessage = `
    Choose what you want to do:
    - /buy [crypto] [amount] in USD (e.g., /buy BTC 100)
    - /sell [crypto] [amount] in USD (e.g., /sell ETH 50)
    `;

    bot.sendMessage(chatId, tradeMessage);
});

// Process Buy command
bot.onText(/\/buy (\w+) (\d+(\.\d+)?)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const crypto = match[1].toUpperCase();
    const usdAmount = parseFloat(match[2]);
    const prices = await getPrices();

    if (prices && prices[crypto.toLowerCase()]) {
        const price = prices[crypto.toLowerCase()].usd;
        const cryptoAmount = usdAmount / price;

        if (usdAmount < 20 || usdAmount > 5000) {
            bot.sendMessage(chatId, 'Minimum buy amount is $20 and maximum is $5000.');
            return;
        }

        trades.push({
            userId: chatId,
            type: 'buy',
            crypto,
            amount: cryptoAmount,
            usdAmount,
            total: usdAmount,
            status: 'pending'
        });

        bot.sendMessage(chatId, `You want to buy ${cryptoAmount.toFixed(2)} ${crypto} for $${usdAmount}. Waiting for a seller to match your order...`);
    } else {
        bot.sendMessage(chatId, 'Invalid cryptocurrency or price data unavailable.');
    }
});

// Process Sell command
bot.onText(/\/sell (\w+) (\d+(\.\d+)?)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const crypto = match[1].toUpperCase();
    const usdAmount = parseFloat(match[2]);
    const prices = await getPrices();

    if (prices && prices[crypto.toLowerCase()]) {
        const price = prices[crypto.toLowerCase()].usd;
        const cryptoAmount = usdAmount / price;

        if (usdAmount < 20 || usdAmount > 5000) {
            bot.sendMessage(chatId, 'Minimum sell amount is $20 and maximum is $5000.');
            return;
        }

        trades.push({
            userId: chatId,
            type: 'sell',
            crypto,
            amount: cryptoAmount,
            usdAmount,
            total: usdAmount,
            status: 'pending'
        });

        bot.sendMessage(chatId, `You want to sell ${cryptoAmount.toFixed(2)} ${crypto} for $${usdAmount}. Waiting for a buyer to match your order...`);
    } else {
        bot.sendMessage(chatId, 'Invalid cryptocurrency or price data unavailable.');
    }
});

// Donate command
bot.onText(/\/donate/, (msg) => {
    const chatId = msg.chat.id;
    const donateMessage = `
    Thank you for considering a donation to support our server and development costs!

    Here are the wallet addresses for donations:

    - **Bitcoin (BTC):** bc1q2zl77rcdqp8kj0yq6z8lvmvccvrq8zuthy7vrl
    - **Ethereum (ETH):** 0xd94a42E6cccA40Fea53Da371057479373F200d38
    - **Solana (SOL):** Fsf1YWcYCrKhkEkb5W6MeSm2yQiGfXM6qdasjjfLhqeY

    Any amount is appreciated and will help keep this project running smoothly. Thank you for your support!
    `;

    bot.sendMessage(chatId, donateMessage);
});

// Match buyers and sellers (escrow service)
const matchTrades = () => {
    for (let trade of trades) {
        if (trade.status === 'pending') {
            const oppositeType = trade.type === 'buy' ? 'sell' : 'buy';
            const oppositeTrade = trades.find(t => t.type === oppositeType && t.status === 'pending' && t.crypto === trade.crypto && Math.abs(t.amount - trade.amount) < 0.1);

            if (oppositeTrade) {
                trade.status = 'completed';
                oppositeTrade.status = 'completed';

                bot.sendMessage(trade.userId, `Your ${trade.type} order for ${trade.amount} ${trade.crypto} has been matched with a ${oppositeTrade.type} order.`);
                bot.sendMessage(oppositeTrade.userId, `Your ${oppositeTrade.type} order for ${oppositeTrade.amount} ${oppositeTrade.crypto} has been matched with a ${trade.type} order.`);
            }
        }
    }
};

// Run the matching process every 30 seconds
setInterval(matchTrades, 30000);
