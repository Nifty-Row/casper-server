function moveFile(file, location) {
  return new Promise((resolve, reject) => {
    file.mv(location, (err) => {
      if (err) {
        console.error(err);
        return reject(false);
      }
      return resolve(true);
    });
  });
}

module.exports = moveFile;
