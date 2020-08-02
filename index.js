const SlackBot = require("slackbots");
const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();

const bot = new SlackBot({
  token: `${process.env.BOT_TOKEN}`,
  name: "slacktest"
});

bot.on("start", () => {
  const params = {
    icon_emoji: ":robot_face:"
  };
  bot.postMessageToChannel(
    "general",
    "Get inspired with inspire nuggets",
    params
  );
});

bot.on("error", error => {
  console.log(error);
});

bot.on("message", data => {
  if (data.type !== "message") {
    return;
  }

  handleMessage(data.text);
});

function handleMessage(message) {
  if (message.includes(" inspire me")) {
    inspireMe();
  } else if (message.includes("random joke")) {
    randomJoke();
  } else if (message.includes(" help")) {
    runHelp();
  }
}

function inspireMe() {
  axios
    .get(
      "https://raw.githubusercontent.com/BolajiAyodeji/inspireNuggets/master/src/quotes.json"
    )
    .then(res => {
      const quotes = res.data;
      const random = Math.floor(Math.random() * quotes.length);
      const quote = quotes[random].quote;
      const author = quotes[random].author;

      const params = {
        icon_emoji: ":robot_face:"
      };

      bot.postMessageToChannel("general", `:zap: ${quote} - *${author}*`),
        params;
    });
}

function randomJoke() {
  axios.get("https://api.chucknorris.io/jokes/random").then(res => {
    const joke = res.data.value;
    const params = {
      icon_emoji: ":smile:"
    };

    bot.postMessageToChannel("general", `:zap: ${joke}`, params);
  });
}

function runHelp() {
  const params = {
    icon_emoji: ":question:"
  };
  bot.postMessageToChannel(
    "general",
    `Type *@inspirenuggets* with *inspire me* to get an inspiring techie quote, \`Random Joke\` to get a Chuck Norris joke and *help* to get this instruction again`,
    params
  );
}
