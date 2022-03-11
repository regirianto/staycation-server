const fs = require("fs");
const path = require("path");

const deleteFiles = (location, namefile) => {
  fs.access(path.join(location, namefile), async (err) => {
    if (!err) {
      await fs.promises.unlink(path.join(location, namefile));
    }
  });
};

module.exports = { deleteFiles };
