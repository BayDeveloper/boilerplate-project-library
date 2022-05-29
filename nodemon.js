{
  "restartable": "rs",
  "ignore": [
      ".git",
      "node_modules/**/node_modules"
  ],
  "verbose": true,
  "watch": [
      "./server.js",
      "./routes/*",
      "./public/*",
      "./controllers/*"
  ],
  "env": {
      "NODE_ENV": "test"
  },
  "ext": "js,json,pug,css"
}