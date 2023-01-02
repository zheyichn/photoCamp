/**
 * This module will start the express server
 */
 const webapp = require("./server");

// define the port
 const port = process.env.PORT || 8080;

// listen on port
 webapp.listen(port, () => {
   console.log(`Server running on port: ${port}`);
 });