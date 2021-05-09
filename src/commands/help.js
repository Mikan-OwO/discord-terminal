module.exports = ({ message, args }) => {
  if (!args.length) {
    message.channel.send(
      "これらのシェルコマンドは内部で定義されています。`help' と入力して一覧を参照してください。\n" +
        "`help 名前' と入力すると `名前' という関数のより詳しい説明が得られます。\n\n",
      { split: { char: "\n" } }
    );
  }
};
