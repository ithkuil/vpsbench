(function() {
  var app, fs, http, processor;

  http = require("http");

  fs = require("fs");

  processor = require("./processor");

  app = http.createServer(function(req, res) {
    res.writeHead(200);
    switch (req.url) {
      case "/gcdmany.sh":
        return res.end(fs.readFileSync("gcdmany.sh"));
      case "/":
        return res.end(fs.readFileSync("index.html"));
      case "/dobench.sh":
        return res.end(fs.readFileSync("dobench.sh"));
      case "/process":
        return res.end(processor.newdata(req));
    }
  });

  app.listen(3000);

}).call(this);
