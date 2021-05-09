const { Client, MessageEmbed } = require("discord.js");
const fs = require("fs");
const path = require("path");
const terminals = require("./data");
const cache = [];

const { token } = require("./config");

const client = new Client();

client.on("ready", () => {
  const commands = fs
    .readdirSync(path.join(__dirname, "./commands"))
    .map((c) => c.split(".").shift());
  commands.forEach((c) => {
    cache.push({
      name: c,
      run: require(`./commands/${c}`),
    });
  });
});

client.on("message", async (message) => {
  const [cmd, ...args] = message.content.split(" ");
  if (message.author.bot) return;

  if (terminals.find((t) => t.chid === message.channel.id))
    parser({ message, cmd, args });
});

function parser({ message, cmd, args }) {
  const terminal = terminals.find((t) => t.chid === message.channel.id);
  const commands = fs
    .readdirSync(path.join(__dirname, "./commands"))
    .map((c) => c.split(".").shift());

  if (terminal.task)
    return cache.find((c) => c.name === terminal.run[0]).run({ message, args });

  if (commands.includes(cmd)) {
    if (cache.some((c) => c.name !== cmd)) {
      cache.push({ name: cmd, run: require(`./commands/${cmd}`) });
    }

    if (!terminal.task)
      cache.find((c) => c.name === cmd).run({ message, args });
  } else {
    message.channel.send(`bash: ${cmd}: コマンドが見つかりません`);
  }
}

client.login(token)
.catch(console.error);
