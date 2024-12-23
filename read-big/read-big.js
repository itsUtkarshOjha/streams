const fs = require("fs/promises");

(async () => {
  const fileHandleRead = await fs.open("src.txt", "r");
  const fileHandleWrite = await fs.open("dest.txt", "w");

  const streamRead = fileHandleRead.createReadStream();
  const streamWrite = fileHandleWrite.createWriteStream();
  streamRead.on("data", (chunk) => {
    if (!streamWrite.write(chunk)) {
      streamRead.pause();
    }
  });

  streamWrite.on("drain", () => {
    streamRead.resume();
  });
})();
