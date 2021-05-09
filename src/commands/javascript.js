const { VM } = require("vm2");
const { inspect } = require("util");
const terminals = require("../terminals");

module.exports = async ({ message, args }) => {
  const place = terminals.find((t) => t.chid === message.channel.id);

  if (!place.task) {
    if (!args.length) {
      place.task = true;
      place.run.push("javascript", new VM({ timeout: 1000 }));

      message.channel.send(
        'Welcome to JavaScript v1.0.0.\nType ".help" for more information.'
      );
    } else {
      args.forEach((a) => {
        switch (a) {
          case "-v":
            {
              message.channel.send("v1.0.0");
            }
            break;
        }
      });
    }
  } else {
    const vm = place.run[1];

    switch (message.content) {
      case ".exit":
        {
          message.channel.send("Good bye");
          place.run.length = 0;
          place.task = false;
        }
        break;

      case ".help":
        {
          message.channel.send(
            ".exit     Exit the REPL\n.help     Print this help message"
          );
        }
        break;

      default:
        {
          try {
            const result = inspect(await vm.run(message.content));
            message.channel.send(result);
          } catch (e) {
            message.channel.send(String(e));
          }
        }
        break;
    }
  }
};
