const app = require("./app");

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Lights off backend has started running on port ${port}`);
});
