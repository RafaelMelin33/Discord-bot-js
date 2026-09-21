# 🤖 GeekBot

GeekBot is an AI-powered Discord bot focused exclusively on geek culture.

It can answer questions about games, anime, manga, movies, TV shows, comics, Marvel, DC, Pokémon, Nintendo, PlayStation, Xbox, PC Gaming, fictional characters, and other geek-related topics.

The bot uses AI models through **OpenRouter**, supports multiple users with separate conversation memories, and automatically switches between different free AI models when one of them is unavailable.

---

## ✨ Features

* 🤖 AI-powered responses
* 🎮 Focused exclusively on geek culture
* 🧠 Separate conversation memory for each Discord user
* ⚡ Streaming AI responses
* 🔄 Automatic fallback between multiple AI models
* 🇧🇷 Responses in Brazilian Portuguese
* 👋 Greeting detection
* 🚫 Rejects questions unrelated to geek culture
* 💾 Local conversation memory using JSON
* 🔐 Environment variables for API keys and Discord tokens

---

## 🎯 Supported Topics

GeekBot can answer questions about:

* 🎮 Games
* 🕹️ Video games
* 💻 PC Gaming
* 🍥 Anime
* 📚 Manga
* 🎬 Movies
* 📺 TV Shows
* 📖 Comics
* 🦸 Marvel
* 🦇 DC
* ⚡ Pokémon
* 🍄 Nintendo
* 🎮 PlayStation
* 🟢 Xbox
* 👾 Fictional characters
* 🌌 Fictional universes
* 🎥 Actors, directors, and creators related to geek culture
* 🖥️ Gaming hardware and technology
* 🌐 Pop culture

If a user asks something unrelated to geek culture, the bot refuses to answer.

Example:

```text
User:
What is the capital of Brazil?

GeekBot:
Sorry, I can only answer questions related to the geek world.
```

---

## 🧠 User Memory

GeekBot keeps a separate conversation history for each Discord user.

For example:

```text
User:
Who is Naruto?

GeekBot:
Naruto Uzumaki is the main character of Naruto...

User:
Who is his father?

GeekBot:
Naruto's father is Minato Namikaze.
```

Each Discord user has an independent conversation history based on their Discord User ID.

Example structure:

```json
{
  "123456789": [
    {
      "role": "user",
      "content": "Who is Naruto?"
    },
    {
      "role": "assistant",
      "content": "Naruto Uzumaki is..."
    }
  ]
}
```

The conversation history is currently stored locally in:

```text
memoria.json
```

---

## 🤖 AI Models

GeekBot uses free models available through OpenRouter.

Current fallback order:

```text
1. inclusionai/ling-3.0-flash-vl:free
2. nex-agi/nex-n2.5-pro:free
3. qwen/qwen3.8-27b:free
4. nvidia/nemotron-3.5-lightning:free
```

If the first model is unavailable or rate-limited, GeekBot automatically tries the next one.

Example:

```text
Ling
 ↓ unavailable

Nex
 ↓ unavailable

Qwen
 ↓ success

Response sent to the user
```

This is especially useful when working with free OpenRouter models, since they may occasionally become temporarily rate-limited.

---

## 🛠️ Technologies

This project currently uses:

* JavaScript
* Node.js
* Discord.js
* OpenAI JavaScript SDK
* OpenRouter API
* dotenv
* Node.js File System API
* JSON for local memory storage

---

## 📁 Project Structure

```text
geekbot/
│
├── bot.js
├── memoria.json
├── package.json
├── package-lock.json
├── .env
├── .gitignore
└── README.md
```

The `node_modules` directory is generated automatically after installing the dependencies.

---

## 🚀 Installation

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
```

Enter the project directory:

```bash
cd YOUR_REPOSITORY
```

---

### 2. Install dependencies

```bash
npm install
```

If the dependencies have not been added yet, install them manually:

```bash
npm install openai dotenv discord.js
```

---

### 3. Configure ES Modules

Make sure your `package.json` contains:

```json
{
  "type": "module"
}
```

---

## 🔑 Environment Variables

Create a `.env` file in the project root:

```env
OPENROUTER_API_KEY=your_openrouter_api_key
DISCORD_TOKEN=your_discord_bot_token
```

Never publish these keys.

Your `.gitignore` should contain:

```gitignore
node_modules/
.env
```

You may also choose to ignore local conversation memory:

```gitignore
memoria.json
```

This is recommended if the file contains real user conversations.

---

## 🌐 OpenRouter Setup

Create an account at:

https://openrouter.ai/

Create an API key and add it to your `.env` file:

```env
OPENROUTER_API_KEY=your_key_here
```

GeekBot uses OpenRouter to access multiple AI models through the same API.

---

## 💬 Discord Bot Setup

Go to:

https://discord.com/developers/applications

Then:

1. Create a new application.
2. Give your application a name.
3. Open the **Bot** section.
4. Create/configure your bot.
5. Copy the bot token.
6. Add the token to your `.env` file.
7. Enable **Message Content Intent**.
8. Add the bot to your Discord server.

Recommended permissions:

```text
View Channels
Send Messages
Read Message History
Embed Links
```

---

## ▶️ Running the Bot

Start the project with:

```bash
node bot.js
```

If the connection is successful, the terminal should display something similar to:

```text
Bot connected as GeekBot
```

---

## 💬 Example Conversations

### Geek question

```text
User:
Who is Gojo Satoru?

GeekBot:
Gojo Satoru is one of the main characters in Jujutsu Kaisen...
```

### Context memory

```text
User:
Who is Goku?

GeekBot:
Goku is the main protagonist of the Dragon Ball franchise...

User:
Who is his oldest son?

GeekBot:
Goku's oldest son is Gohan.
```

### Non-geek question

```text
User:
How much is 50 + 50?

GeekBot:
Sorry, I can only answer questions related to the geek world.
```

### Greeting

```text
User:
Hello

GeekBot:
Hello! 😊
```

### Greeting with an unrelated question

```text
User:
Hello, what is the capital of France?

GeekBot:
Hello! 😊 Sorry, I can only answer questions related to the geek world.
```

---

## 🔄 Model Fallback System

GeekBot does not depend on only one AI model.

If a model returns an error such as:

```text
429 Rate Limit
```

the bot automatically tries the next model from the configured list.

This makes the bot more reliable when using free AI providers.

---

## 🧠 Geek Content Validation

Before answering a question, GeekBot checks whether the message is related to geek culture.

The validation also considers conversation context.

For example:

```text
User:
Who is Naruto?

User:
Who is his father?
```

Even though the second question does not explicitly mention Naruto, the bot understands the context and allows the question.

---

## 🔮 Planned Features

Future versions of GeekBot may include:

* 📰 Daily geek news
* 🔎 Real-time geek news search
* 🎮 Game news
* 🍥 Anime and manga news
* 🎬 Movie and TV show news
* 🦸 Marvel and DC news
* 📅 Upcoming game, movie, and anime releases
* ⚡ Discord Slash Commands
* `/geek`
* `/news`
* `/anime`
* `/game`
* `/releases`
* 🔔 Automatic daily news messages
* 🖼️ Image understanding
* 🗄️ Database-based user memory
* ⚙️ Per-server configuration
* 🎯 Personalized geek interests

---

## 📰 Future Daily News System

One of the main planned features is an automatic daily geek news summary.

Example:

```text
🔥 DAILY GEEK NEWS

🎮 GAMES
New game announcements and updates...

🍥 ANIME
New trailers and anime announcements...

🎬 MOVIES
New Marvel, DC, and movie news...

📺 TV SHOWS
Streaming and series announcements...

🕹️ HARDWARE
PlayStation, Xbox, Nintendo, and PC Gaming news...
```

The bot will retrieve recent information from external sources and use AI to summarize it before publishing it to Discord.

---

## 🔐 Security

Never expose:

```text
DISCORD_TOKEN
OPENROUTER_API_KEY
```

Do not write secrets directly inside `bot.js`.

Always use environment variables:

```js
process.env.DISCORD_TOKEN
process.env.OPENROUTER_API_KEY
```

If a Discord token or API key is accidentally published, revoke it immediately and generate a new one.

---

## ⚠️ Important

Free AI models on OpenRouter may occasionally:

* Become temporarily unavailable
* Return rate-limit errors
* Have provider restrictions
* Change availability

GeekBot reduces this problem by automatically switching between multiple models.

---

## 📌 Status

🚧 **Project currently under development**

The current focus is:

```text
Discord Integration
        +
AI Responses
        +
Geek-Only Filtering
        +
Per-User Memory
        +
Multiple AI Model Fallback
```

Daily geek news and additional Discord commands will be added in future versions.

---

## 👨‍💻 Author

Developed as an AI-powered Discord assistant focused on games, anime, movies, series, and geek culture.

---

## 📄 License

This project is intended for educational and development purposes.

A license can be added later depending on how the project will be distributed.
