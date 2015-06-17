var http = require('http');
var path = require('path');
var url = require('url');
var send = require('send');
var fs = require('fs');
var server = http.createServer(function(req, res) {
  var root = path.dirname(__dirname);
  var pathname = url.parse(req.url).pathname;
  send(req, pathname, {
    root: root
  })
  .on('error', function (err) {
    //若是根目录下找不到index.html则按目录处理
    if (err.status === 404 && pathname === '/') {
      readDir(pathname, root, res);
    } else {
      res.statusCode = err.status || 500;
      res.end(err.message);
    }
  })
  .on('directory', function () {
    readDir(pathname, path.join(root, pathname), res);
  }).pipe(res);
}).listen(3000);
function readDir(pathname, dir, res) {
    fs.readdir(dir, function (err, files) {
      if (err) {
        res.writeHead(500, {
          'Content-Type': 'text/plain'
        });
        res.end(err.message);
        return;
      }
      var html = "";
      html = '<ul>';
      if (pathname !== '/') {
        html += '<li><a href="' + path.dirname(pathname).replace(/\\+/g, '/') + '">Parent Directory</a></li>';
      }
      for (var i = 0, l = files.length; i < l; i++) {
        html += '<li><a href="' + path.join(pathname, files[i]).replace(/\\+/g, '/') + '">' + files[i] + '</a></li>';
      }
      html += '</ul>';
      res.writeHead(200, {
        'Content-Type': 'text/html'
      });
      res.write(html);
      res.end();
    });
  }
