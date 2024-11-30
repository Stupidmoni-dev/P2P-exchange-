```markdown
# P2P Crypto Exchange Bot (Demo)

This is a **demo** showcasing a decentralized P2P crypto exchange bot built with **Node.js**, **Telegram Bot API**, and **CoinGecko API**. The bot allows users to buy, sell, and check real-time crypto prices within a Telegram group. It includes an escrow system that matches buyers and sellers automatically.

> **Disclaimer**: This is a demo version. If you're interested in developing a similar project, check out the bot or contact the developer for collaboration opportunities.

## Key Features

- **Buy/Sell Crypto**: Users can execute buy or sell orders using USD for cryptocurrencies like Bitcoin, Ethereum, Solana, and more.
- **Real-Time Prices**: The bot fetches live cryptocurrency prices from the CoinGecko API.
- **Trade History**: Users can track their transaction history.
- **Escrow Matching**: The bot ensures secure trading by matching buyers with sellers based on trade criteria.
- **Donation Support**: Accepts crypto donations to support the project.

## Demo Access

Try out the [P2P Crypto Exchange Bot](https://t.me/P2P_CryptBot) on Telegram to experience its features. Feel free to place mock trades and explore the bot’s functionality.

## Local Setup Guide

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-repository-name/p2p-crypto-bot.git
   cd p2p-crypto-bot
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure the Bot**:
   - Open `bot.js` and replace `'YOUR_BOT_TOKEN'` with your Telegram bot token.

4. **Run the Bot**:
   ```bash
   node bot.js
   ```

5. **Keep the Bot Running with PM2**:
   - Install PM2 globally:
     ```bash
     npm install -g pm2
     ```
   - Start the bot using PM2:
     ```bash
     pm2 start bot.js --name p2p_crypto_bot
     ```

## Developer Contact

Interested in building a similar project or want to collaborate? Contact the developer:

- **Telegram**: [@stupidmoni](https://t.me/stupidmoni)

> **Note**: Only serious inquiries are entertained. Please avoid non-serious messages or trivial questions.

## License

This demo is open-source and available for educational purposes. Feel free to fork, modify, or enhance it for your own needs. However, ensure ethical use and refrain from illegal activities.
```
