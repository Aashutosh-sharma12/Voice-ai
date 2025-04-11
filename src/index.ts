import "./pre-start"; // Must be the first import
import server from "./server";
const { createServer } = require("http");
// Constants
const serverStartMsg = "Express server started on port: ",
  port = process.env.PORT || 3000;

const httpServer = createServer(server);
// Start serverqqqqq
httpServer.listen(port, (req: any, res: any) => {
  console.log(serverStartMsg + port);
});