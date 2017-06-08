#!/usr/bin/env node

import * as fs from "fs";
import * as ts from "typescript";
import * as args from "args";
import * as path from "path";

const allRWEPermissions = parseInt("0777", 8);
function walk(dir: string, results?: string[]): string[] {
  if(!results) results = [];
  var files = fs.readdirSync(dir);
  files.forEach(file => {
    let fullpath = path.join(dir,file);
    if(fs.lstatSync(fullpath).isDirectory()){
      walk(fullpath, results);
    }else{
      results.push(fullpath);
    }
  });
  return results;

  // fs.readdir(dir, function(err, list) {
  //   if (err) return done(err);
  //   var i = 0;
  //   (function next() {
  //     var file = list[i++];
  //     if (!file) return done(null, results);
  //     file = path.join(dir, file);
  //     fs.stat(file, function(err, stat) {
  //       if (stat && stat.isDirectory()) {
  //         walk(file, function(err, res) {
  //           results = results.concat(res);
  //           next();
  //         });
  //       } else {
  //         results.push(file);
  //         next();
  //       }
  //     });
  //   })();
  // });

};
function ensureFilePathExists(filepath: string, mask: number = allRWEPermissions): Promise<void> {
  return new Promise<void>(
    function(resolve: (value?: void | PromiseLike<void>) => void, reject: (reason?: any) => void): void {
      const sep = path.sep;
      const initDir = path.isAbsolute(filepath) ? sep : '';
      filepath.split(sep).reduce((parentDir, childDir) => {
        const curDir = path.resolve(parentDir, childDir);
        if (!fs.existsSync(curDir)) {
          fs.mkdirSync(curDir, mask);
        }
        return curDir;
      }, initDir);

      // fs.mkdir(path, mask, function(err: NodeJS.ErrnoException): void {
      //   console.log(err);
      //   if (err) {
      //     if (err.code === "EEXIST") {
      //       resolve(null); // ignore the error if the folder already exists
      //     } else {
      //       reject(err); // something else went wrong
      //     }
      //   } else {
      //     resolve(null); // successfully created folder
      //   }
      // });
    }
  );
}

/**
 * Build Typescript files when changing them
 * @param {string[]}           rootFileNames [description]
 * @param {ts.CompilerOptions} options       [description]
 */
function tsWatchDir(dir: string, options: ts.CompilerOptions) {
  const rootFileNames = walk(dir)
    .filter(fileName => fileName.length >= 3 && path.extname(fileName) === ".ts");

  const files: ts.MapLike<{ version: number }> = {};

  // initialize the list of files
  rootFileNames.forEach(fileName => {
    files[fileName] = { version: 0 };
  });

  // Create the language service host to allow the LS to communicate with the host
  const servicesHost: ts.LanguageServiceHost = {
    getScriptFileNames: () => rootFileNames,
    getScriptVersion: (fileName) => files[fileName] && files[fileName].version.toString(),
    getScriptSnapshot: (fileName) => {
      if (!fs.existsSync(fileName)) {
        return undefined;
      }

      return ts.ScriptSnapshot.fromString(fs.readFileSync(fileName).toString());
    },
    getCurrentDirectory: () => process.cwd(),
    getCompilationSettings: () => options,
    getDefaultLibFileName: (options) => ts.getDefaultLibFilePath(options),
  };

  // Create the language service files
  const services = ts.createLanguageService(servicesHost, ts.createDocumentRegistry())

  // Now let's watch the files
  rootFileNames.forEach(fileName => {
    // First time around, emit all files
    emitFile(fileName);

    // Add a watch on the file to handle next change
    fs.watchFile(fileName,
      { persistent: true, interval: 250 },
      (curr, prev) => {
        // Check timestamp
        if (+curr.mtime <= +prev.mtime) {
          return;
        }

        // Update the version to signal a change in the file
        files[fileName].version++;

        // write the changes to disk
        emitFile(fileName);
      });
  });

  function emitFile(fileName: string) {
    let output = services.getEmitOutput(fileName);

    if (!output.emitSkipped) {
      console.log(`Emitting ${fileName}`);
    }
    else {
      console.log(`Emitting ${fileName} failed`);
      logErrors(fileName);
    }

    output.outputFiles.forEach(o => {
      let outputName = o.name.substring(options.outDir.length + 1);
      outputName = path.join(options.outDir, outputName.substring(dir.length + 1));
      ensureFilePathExists(path.dirname(outputName));
      fs.writeFileSync(outputName, o.text, "utf8");
    });
  }

  function logErrors(fileName: string) {
    let allDiagnostics = services.getCompilerOptionsDiagnostics()
      .concat(services.getSyntacticDiagnostics(fileName))
      .concat(services.getSemanticDiagnostics(fileName));

    allDiagnostics.forEach(diagnostic => {
      let message = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");
      if (diagnostic.file) {
        let { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
        console.log(`  Error ${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`);
      } else {
        console.log(`  Error: ${message}`);
      }
    });
  }
}

// Start the watcher
args
  .option('watch', 'Watch changes');
const flags = args.parse(process.argv);

if(flags.w){
  tsWatchDir("src/server", { module: ts.ModuleKind.CommonJS, outDir: "dist/server" });
}

// Copy static client files
ensureFilePathExists("dist/client");
fs.createReadStream('src/client/index.html').pipe(fs.createWriteStream('dist/client/index.html'));
