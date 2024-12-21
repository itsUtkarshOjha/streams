import * as fs from "fs/promises";

//The follwing is a bad practice, this is not to be done this way as it consumes a lot of memory!
// (async () => {
//   console.time("writing");
//   const fileHandle = await fs.open("test.txt", "w");
//   const stream = fileHandle.createWriteStream();
//   for (let i = 0; i < 1000000; i++) {
//     const buff = Buffer.from(` ${i} `, "utf-8");
//     stream.write(buff);
//     // await fileHandle.write(` ${i} `);
//   }
//   console.timeEnd("writing");
// })();

(async () => {
  // console.time("Writing");

  const fileHandle = await fs.open("test.txt", "w");
  const stream = fileHandle.createWriteStream();

  // const buff = Buffer.alloc(stream.writableHighWaterMark, 10);
  // console.log(stream.writableHighWaterMark);
  // console.log(buff);
  // console.log(stream.writableLength);

  // console.timeEnd("Writing");
  // console.log(stream.write(buff));

  console.time("writeMany");
  let i = 0;
  let drainedCount = 0;
  const writeMany = () => {
    while (i < 1000000) {
      const buff = Buffer.from(` ${i} `, "utf-8");
      if (i === 999999) {
        return stream.end(buff);
      }
      i++;
      if (!stream.write(buff)) {
        break;
      }
    }
  };

  writeMany();

  stream.on("drain", () => {
    drainedCount++;
    writeMany();
  });

  stream.on("finish", () => {
    console.log(drainedCount);
    console.timeEnd("writeMany");
    fileHandle.close();
  });

  // fileHandle.close();
})();
