const fs = require("fs");
const path = require("path");
const deleteFiles = (location, namefile) => {
  fs.unlink(path.join(location, namefile), (error) => {
    if (error) {
      console.log(error);
    }
  });
};

module.exports = { deleteFiles };
