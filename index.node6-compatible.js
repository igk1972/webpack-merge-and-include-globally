"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var fs = require('fs');

var glob = require('glob');

var _require = require('es6-promisify'),
    promisify = _require.promisify;

var revHash = require('rev-hash');

var plugin = {
  name: 'MergeIntoFile'
};
var webpackMajorVersion = Number(require('webpack/package.json').version.split('.')[0]);
var readFile = promisify(fs.readFile);
var listFiles = promisify(glob);

var joinContent = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(promises, separator) {
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            return _context2.abrupt("return", promises.reduce( /*#__PURE__*/function () {
              var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(acc, curr) {
                return _regenerator["default"].wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _context.t2 = "";
                        _context.next = 3;
                        return acc;

                      case 3:
                        _context.t3 = _context.sent;
                        _context.t1 = _context.t2.concat.call(_context.t2, _context.t3);
                        _context.next = 7;
                        return acc;

                      case 7:
                        if (!_context.sent.length) {
                          _context.next = 11;
                          break;
                        }

                        _context.t4 = separator;
                        _context.next = 12;
                        break;

                      case 11:
                        _context.t4 = '';

                      case 12:
                        _context.t5 = _context.t4;
                        _context.t0 = _context.t1.concat.call(_context.t1, _context.t5);
                        _context.next = 16;
                        return curr;

                      case 16:
                        _context.t6 = _context.sent;
                        return _context.abrupt("return", _context.t0.concat.call(_context.t0, _context.t6));

                      case 18:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee);
              }));

              return function (_x3, _x4) {
                return _ref2.apply(this, arguments);
              };
            }(), ''));

          case 1:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function joinContent(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

var MergeIntoFile = /*#__PURE__*/function () {
  function MergeIntoFile(options, onComplete) {
    (0, _classCallCheck2["default"])(this, MergeIntoFile);
    this.options = options;
    this.onComplete = onComplete;
  }

  (0, _createClass2["default"])(MergeIntoFile, [{
    key: "apply",
    value: function apply(compiler) {
      if (compiler.hooks) {
        if (webpackMajorVersion < 5) {
          compiler.hooks.emit.tapAsync(plugin, this.run.bind(this));
        } else {
          compiler.hooks.compilation.tap(plugin, this.run.bind(this));
          compiler.hooks.failed.tap(plugin, function (error) {
            throw new Error(error);
          });
        }
      } else {
        compiler.plugin('emit', this.run.bind(this));
      }
    }
  }, {
    key: "run",
    value: function run(compilation, callback) {
      var _this = this;

      var _this$options = this.options,
          files = _this$options.files,
          transform = _this$options.transform,
          encoding = _this$options.encoding,
          chunks = _this$options.chunks,
          hash = _this$options.hash,
          transformFileName = _this$options.transformFileName;

      if (chunks && compilation.chunks && compilation.chunks.filter(function (chunk) {
        return chunks.indexOf(chunk.name) >= 0 && chunk.rendered;
      }).length === 0) {
        if (typeof callback === 'function') {
          callback();
        }

        return;
      }

      var generatedFiles = {};
      var filesCanonical = [];

      if (!Array.isArray(files)) {
        Object.keys(files).forEach(function (newFile) {
          filesCanonical.push({
            src: files[newFile],
            dest: newFile
          });
        });
      } else {
        filesCanonical = files;
      }

      filesCanonical.forEach(function (fileTransform) {
        if (typeof fileTransform.dest === 'string') {
          var destFileName = fileTransform.dest;

          fileTransform.dest = function (code) {
            return (0, _defineProperty2["default"])({}, destFileName, transform && transform[destFileName] ? transform[destFileName](code) : code);
          };
        }
      });
      var finalPromises = filesCanonical.map( /*#__PURE__*/function () {
        var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(fileTransform) {
          var _this$options$separat, separator, listOfLists, flattenedList, filesContentPromises, content, resultsFiles;

          return _regenerator["default"].wrap(function _callee4$(_context4) {
            while (1) {
              switch (_context4.prev = _context4.next) {
                case 0:
                  _this$options$separat = _this.options.separator, separator = _this$options$separat === void 0 ? '\n' : _this$options$separat;
                  _context4.next = 3;
                  return Promise.all(fileTransform.src.map(function (path) {
                    return listFiles(path, null);
                  }));

                case 3:
                  listOfLists = _context4.sent;
                  flattenedList = Array.prototype.concat.apply([], listOfLists);
                  filesContentPromises = flattenedList.map(function (path) {
                    return readFile(path, encoding || 'utf-8');
                  });
                  _context4.next = 8;
                  return joinContent(filesContentPromises, separator);

                case 8:
                  content = _context4.sent;
                  _context4.next = 11;
                  return fileTransform.dest(content);

                case 11:
                  resultsFiles = _context4.sent;
                  Object.keys(resultsFiles).map( /*#__PURE__*/function () {
                    var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(resultsFile) {
                      return _regenerator["default"].wrap(function _callee3$(_context3) {
                        while (1) {
                          switch (_context3.prev = _context3.next) {
                            case 0:
                              if (!((0, _typeof2["default"])(resultsFiles[resultsFile]) === 'object')) {
                                _context3.next = 4;
                                break;
                              }

                              _context3.next = 3;
                              return resultsFiles[resultsFile];

                            case 3:
                              resultsFiles[resultsFile] = _context3.sent;

                            case 4:
                            case "end":
                              return _context3.stop();
                          }
                        }
                      }, _callee3);
                    }));

                    return function (_x6) {
                      return _ref5.apply(this, arguments);
                    };
                  }());
                  Object.keys(resultsFiles).forEach(function (newFileName) {
                    var newFileNameHashed = newFileName;
                    var hasTransformFileNameFn = typeof transformFileName === 'function';

                    if (hash || hasTransformFileNameFn) {
                      var hashPart = MergeIntoFile.getHashOfRelatedFile(compilation.assets, newFileName) || revHash(resultsFiles[newFileName]);

                      if (hasTransformFileNameFn) {
                        var extensionPattern = /\.[^.]*$/g;
                        var fileNameBase = newFileName.replace(extensionPattern, '');

                        var _newFileName$match = newFileName.match(extensionPattern),
                            _newFileName$match2 = (0, _slicedToArray2["default"])(_newFileName$match, 1),
                            extension = _newFileName$match2[0];

                        newFileNameHashed = transformFileName(fileNameBase, extension, hashPart);
                      } else {
                        newFileNameHashed = newFileName.replace(/(\.min)?\.\w+(\.map)?$/, function (suffix) {
                          return "-".concat(hashPart).concat(suffix);
                        });
                      }

                      var fileId = newFileName.replace(/\.map$/, '').replace(/\.\w+$/, '');

                      if (typeof compilation.addChunk === 'function') {
                        var chunk = compilation.addChunk(fileId);
                        chunk.id = fileId;
                        chunk.ids = [chunk.id];
                        chunk.files.push(newFileNameHashed);
                      }
                    }

                    generatedFiles[newFileName] = newFileNameHashed;

                    if (compilation.hooks) {
                      var _require2 = require('webpack'),
                          sources = _require2.sources,
                          Compilation = _require2.Compilation; // eslint-disable-line global-require


                      compilation.hooks.processAssets.tap({
                        name: plugin.name,
                        stage: Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL
                      }, function () {
                        compilation.emitAsset(newFileNameHashed, new sources.RawSource(resultsFiles[newFileName]));
                      });
                    } else {
                      compilation.assets[newFileNameHashed] = {
                        // eslint-disable-line no-param-reassign
                        source: function source() {
                          return resultsFiles[newFileName];
                        },
                        size: function size() {
                          return resultsFiles[newFileName].length;
                        }
                      };
                    }
                  });

                case 14:
                case "end":
                  return _context4.stop();
              }
            }
          }, _callee4);
        }));

        return function (_x5) {
          return _ref4.apply(this, arguments);
        };
      }());
      Promise.all(finalPromises).then(function () {
        if (_this.onComplete) {
          _this.onComplete(generatedFiles);
        }

        if (typeof callback === 'function') {
          callback();
        }
      })["catch"](function (error) {
        if (typeof callback === 'function') {
          callback(error);
        } else {
          throw new Error(error);
        }
      });
    }
  }], [{
    key: "getHashOfRelatedFile",
    value: function getHashOfRelatedFile(assets, fileName) {
      var hashPart = null;
      Object.keys(assets).forEach(function (existingFileName) {
        var match = existingFileName.match(/-([0-9a-f]+)(\.min)?(\.\w+)(\.map)?$/);
        var fileHashPart = match && match.length && match[1];

        if (fileHashPart) {
          var canonicalFileName = existingFileName.replace("-".concat(fileHashPart), '').replace(/\.map$/, '');

          if (canonicalFileName === fileName.replace(/\.map$/, '')) {
            hashPart = fileHashPart;
          }
        }
      });
      return hashPart;
    }
  }]);
  return MergeIntoFile;
}();

module.exports = MergeIntoFile;
