const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

// Replace with your Telegram Bot Token
const token = '7680051999:AAFoJugHaGH-ALQvcUwuZJm5XoF3yQvA_mc';

// Create bot instance
const bot = new TelegramBot(token, { polling: true });

// Database simulation (In-memory storage for simplicity)
let users = {};
let trades = [];
let kycStatus = {};

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

// Welcome message
bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    const userName = msg.from.first_name;

    // Store user information in database
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
    /kyc - View or complete KYC.
    /history - View your trade history.
    /support - Reach out to our developer for help or issues.
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

// Process KYC command
bot.onText(/\/kyc/, (msg) => {
    const chatId = msg.chat.id;

    if (!users[chatId].kyc) {
        bot.sendMessage(chatId, 'Please provide your KYC information in one message (e.g., Name, ID, Address, etc.).');
    } else {
        bot.sendMessage(chatId, 'Your KYC is already complete. You can now proceed.');
    }
});

// Handle KYC submission and forward to @tanzahostbot
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    
    if (msg.text && !users[chatId].kyc && !msg.text.startsWith('/')) {
        const kycData = msg.text;
        users[chatId].kyc = true;
        bot.sendMessage(chatId, 'Thank you for submitting your KYC! You can now proceed with your trades.');

        // Forward KYC data to @tanzahostbot
        bot.forwardMessage(7365008829, chatId, msg.message_id);
    }
});

// Match buyers and sellers (escrow service)
const matchTrades = () => {
    for (let trade of trades) {
        if (trade.status === 'pending') {
            const oppositeType = trade.type === 'buy' ? 'sell' : 'buy';
            const oppositeTrade = trades.find(t => t.type === oppositeType && t.status === 'pending' && t.crypto === trade.crypto && Math.abs(t.amount - trade.amount) < 0.01);

            if (oppositeTrade) {
                // Match buyer and seller
                trade.status = 'matched';
                oppositeTrade.status = 'matched';
                bot.sendMessage(trade.userId, `Your ${trade.type} order for ${trade.amount.toFixed(2)} ${trade.crypto} has been matched with a ${oppositeTrade.type} order. The trade is now in progress.`);
                bot.sendMessage(oppositeTrade.userId, `Your ${oppositeTrade.type} order for ${oppositeTrade.amount.toFixed(2)} ${oppositeTrade.crypto} has been matched with a ${trade.type} order. The trade is now in progress.`);
            }
        }
    }
};

// Set an interval to check for matching trades every 30 seconds
setInterval(matchTrades, 30000);

// New /support command for debugging or user assistance
bot.onText(/\/support/, (msg) => {
    const chatId = msg.chat.id;
    const supportMessage = `
    Need help or facing an issue? Reach out to our developer for assistance:
    - Developer Contact: @stupidmoni
    You can also report bugs or ask for help with your trades or KYC process.
    We're here to assist you!
    `;

    bot.sendMessage(chatId, supportMessage);
});
