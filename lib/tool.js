"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handler = exports.builder = exports.describe = exports.command = void 0;

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _child_process = require("child_process");

var _chalk = _interopRequireDefault(require("chalk"));

var _dedent = _interopRequireDefault(require("dedent"));

var _project = _interopRequireDefault(require("@lerna/project"));

var _asciiBox = require("ascii-box");

var _npmlog = _interopRequireDefault(require("npmlog"));

var _server = _interopRequireDefault(require("./server"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * Yargs command used to release scoped packages in the presentation layer.
 */
var ReleaseCommand =
/*#__PURE__*/
function () {
  function ReleaseCommand(YargsConfig) {
    var _this = this;

    _classCallCheck(this, ReleaseCommand);

    this.handler = function (argv) {
      _this.scope = argv.scope;
      _this.scopedDependencies = argv.scopedDependencies;
      console.log(_this.scope);

      _this.lernaProject.getPackages().then(function (projectPackages) {
        _this._setScopedPackages(projectPackages);

        (0, _server.default)(_this.scopedPackages, _this.scopedDependencies);
      }).catch(function (err) {
        _npmlog.default.error(err);
      });
    };

    this.lernaProject = new _project.default();
    this.scope = YargsConfig.builder.scope.default;
    this.scopedDependencies = YargsConfig.builder.scope.scopedDependencies;
    this.scopedPackages = [];
  }
  /**
   * 📌Report the release success.
   */


  _createClass(ReleaseCommand, [{
    key: "_reportSuccess",
    value: function _reportSuccess() {
      this.scopedPackages.forEach(function (pkg) {
        _npmlog.default.success("".concat(_chalk.default.reset(pkg), " ").concat(_chalk.default.green('✔ Released')));
      });
    }
    /**
     * 📌Set the scoped packages and paths to be used by the version command.
     * @example ./tools/abc-scripts/*
     */

  }, {
    key: "_setScopedPackages",
    value: function _setScopedPackages(projectPackages) {
      var _this2 = this;

      console.log(projectPackages);
      projectPackages.forEach(function (pkg) {
        if (pkg.name.match(new RegExp(_this2.scope))) {
          _this2.scopedPackages.push(pkg);
        }
      });

      if (!this.scopedPackages.length) {
        _npmlog.default.error('Scoped packages', 'None matching package for the passed scope!!!');
      }
    }
    /**
     * The handler method called by Yarn to execute and process the release command.
     * @example
     * abc-scripts release "dls-components|abc-components"
     */

  }]);

  return ReleaseCommand;
}();
/**
 * Yargs command configuration.
 * @todo add a loglevel attribute for “silent”, “error”, “warn”, “info” or “verbose” logs.
 */


var YargsConfig = {
  command: 'graph',
  describe: 'Generates a dependency graph for the mono packages',
  builder: {
    scope: {
      describe: 'Glob for scoped packages',
      default: '.*',
      type: 'string'
    },
    scopedDependencies: {
      describe: 'Glob for scoped dependencies',
      default: '.*',
      type: 'string'
    }
  }
};
var releaseCommand = new ReleaseCommand(YargsConfig);
var command = YargsConfig.command;
exports.command = command;
var builder = YargsConfig.builder;
exports.builder = builder;
var describe = YargsConfig.describe;
exports.describe = describe;
var handler = releaseCommand.handler;
exports.handler = handler;