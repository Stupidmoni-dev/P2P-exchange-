---

# P2P Crypto Exchange Bot

This is a **demo** of a decentralized P2P crypto exchange bot built using **Node.js**, **Telegram Bot API**, and **CoinGecko API** for fetching cryptocurrency prices. The bot allows users to buy, sell, and view crypto prices within a Telegram group. It also features an escrow service to match buyers and sellers.

> **Note**: This is just a demo project. Serious buyers or developers looking to build similar systems should check out the demo or get in touch for collaboration.

## Features

- **Buy/Sell Crypto**: Users can place buy or sell orders with a specified amount of USD for different cryptocurrencies like Bitcoin, Ethereum, Solana, etc.
- **View Crypto Prices**: Fetch real-time cryptocurrency prices via the CoinGecko API.
- **Trade History**: Users can view their trade history.
- **Escrow Service**: The bot automatically matches buy and sell orders based on criteria like crypto type and order amount.
- **Donation Support**: Users can donate using various crypto wallets.

## Demo

To try out the bot, join the [P2P Crypto Exchange Bot](https://t.me/P2P_CryptBot) on Telegram. You can interact with the bot directly, place demo buy and sell orders, and see how it works in action.

## How to Run the Bot Locally

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-repository-name/p2p-crypto-bot.git
   cd p2p-crypto-bot
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up the bot**:
   - Create a `bot.js` file and set your bot token directly (replace `'YOUR_BOT_TOKEN'` with your Telegram Bot Token).
   
4. **Start the bot**:
   ```bash
   node bot.js
   ```

5. **Run the bot permanently with PM2**:
   - Install PM2 globally:
     ```bash
     npm install -g pm2
     ```
   - Start the bot with PM2:
     ```bash
     pm2 start bot.js --name p2p_crypto_bot
     ```

## Connect with the Developer

If you are serious about developing such a system or want to discuss collaboration, feel free to reach out to the developer:

- **Telegram**: [@stupidmoni](https://t.me/stupidmoni)

> **Note**: Please refrain from sending silly or non-serious messages. Only serious buyers and developers should contact.

## License

This project is open-source and provided as a demo. Feel free to fork, modify, and extend the bot for your own use. However, please ensure to respect the project's purpose and do not use it for any illegal activities.

---
