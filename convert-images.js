"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sharp_1 = require("sharp");
var fs_1 = require("fs");
var path_1 = require("path");
var inputRoot = 'C:/Users/HP/Desktop/PROPERTY/DUCHESS HOMES';
var outputRoot = 'C:/Users/HP/Desktop/PROPERTY/DUCHESS HOMES WEBP';
function convertImagesInFolder(currentInputPath, currentOutputPath) {
    fs_1.default.mkdirSync(currentOutputPath, { recursive: true });
    var entries = fs_1.default.readdirSync(currentInputPath, { withFileTypes: true });
    var _loop_1 = function (entry) {
        var inputPath = path_1.default.join(currentInputPath, entry.name);
        var outputPath = path_1.default.join(currentOutputPath, entry.name);
        if (entry.isDirectory()) {
            convertImagesInFolder(inputPath, outputPath);
        }
        else {
            var ext = path_1.default.extname(entry.name).toLowerCase();
            var baseName = path_1.default.basename(entry.name, ext);
            if (['.jpg', '.jpeg', '.png'].includes(ext)) {
                var webpOutput = path_1.default.join(currentOutputPath, baseName + '.webp');
                (0, sharp_1.default)(inputPath)
                    .webp({ quality: 75 })
                    .toFile(webpOutput)
                    .then(function () { return console.log("\u2705 Converted: ".concat(inputPath)); })
                    .catch(function (err) { return console.error("\u274C Error: ".concat(inputPath), err); });
            }
        }
    };
    for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
        var entry = entries_1[_i];
        _loop_1(entry);
    }
}
convertImagesInFolder(inputRoot, outputRoot);
