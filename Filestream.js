var zlib = require('zlib');
 
var util = require('util');
var fs = require('fs');
var stream = require('stream');
var async = require('async');
 
 
function FileStream (transform, encoding) {
    stream.Stream.apply(this);
    this.readable = true;
    this.writable = true;
 
    var self = this;
 
    this._queue = async.queue(function(filename, callback) {
        if(filename == '') return callback();
        var stream = fs.createReadStream(filename);
 
        if(transform) {
            var t = transform(filename);
            stream.pipe(t);
            stream = t;
        }
 
        stream.on('error', callback);
        stream.on('data', function(data) {
          self.emit('data', data);
        });
        stream.on('end', function() {
            callback();
        });
    }, 1)
 
}
util.inherits(FileStream, stream.Stream);
 
FileStream.prototype.write = function write(chunk) {
    var self = this;
    this._queue.push(chunk, function(err) {
        if(err) return self.emit('error', err);
    });
};
 
FileStream.prototype.end = function end() {
    var self = this;
    this._queue.push('', function() {
        self.emit('end');
    })
};
 
 
module.exports = FileStream;