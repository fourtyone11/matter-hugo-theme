#!/usr/bin/env node

const { program } = require("commander");
const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const https = require("https");

const ASSETS_CSS_FOLDER = path.resolve(__dirname, "assets/css");
const STYLE_FILE = path.resolve(ASSETS_CSS_FOLDER, "style.css");
const COMPONENTS_FOLDER = path.resolve(ASSETS_CSS_FOLDER, "components");
const ELEMENTS_FOLDER = path.resolve(ASSETS_CSS_FOLDER, "elements");
const GENERIC_FOLDER = path.resolve(ASSETS_CSS_FOLDER, "generic");
const OBJECTS_FOLDER = path.resolve(ASSETS_CSS_FOLDER, "objects");
const SETTINGS_FOLDER = path.resolve(ASSETS_CSS_FOLDER, "settings");
const UTILITIES_FOLDER = path.resolve(ASSETS_CSS_FOLDER, "utilities");
const normalizecssURL =
  "https://necolas.github.io/normalize.css/8.0.1/normalize.css";

const layerRegex = /(components|elements|generic|objects|settings|utilities)/

function isLayerExist(name) {
  return layerRegex.test(name)
}

function setupITCSS() {
  const styleFileContent = `
/* settings */
@import "settings/index.css";
/* end */

/* generics */
@import "generic/index.css";
@import "generic/box-sizing.css";
@import "generic/normalize.css";
/* end */

/* elements */
/* end */

/* objects */
/* end */

/* components */
/* end */

/* utilities */
/* end */
  `;

  const settingsContent = `
:root {
  --main-color: hsl(0, 0%, 20%);
  --secondary-color: hsl(0, 0%, 93%);
  --accent-color: hsl(31, 32%, 66%);
  --extra-color: hsl(227, 11%, 45%);

  --sans-serif: sans-serif;
  --serif: serif;
  --monospace: monospace;
}

@custom-media --small-viewport (min-width: 20rem);
@custom-media --medium-viewport (min-width: 42rem);
@custom-media --large-viewport (min-width: 66rem);
  `;

  const genericIndexContent = `
*, html, body {
  font-family: var(--sans-serif);
}
  `;
  const genericBoxSizingContent = `html {
  box-sizing: border-box;
}

* {

  &,
  &:before,
  &:after {
    box-sizing: inherit;
  }

}
  `;

  fs.writeFileSync(STYLE_FILE, styleFileContent);

  if (!fs.existsSync(SETTINGS_FOLDER)) {
    fs.mkdirSync(SETTINGS_FOLDER);
  }
  fs.writeFileSync(path.resolve(SETTINGS_FOLDER, "index.css"), settingsContent);

  if (!fs.existsSync(GENERIC_FOLDER)) {
    fs.mkdirSync(GENERIC_FOLDER);
  }

  fs.writeFileSync(
    path.resolve(GENERIC_FOLDER, "index.css"),
    genericIndexContent
  );
  fs.writeFileSync(
    path.resolve(GENERIC_FOLDER, "box-sizing.css"),
    genericBoxSizingContent
  );

  https.get(normalizecssURL, (res) => {
    const { statusCode } = res;
    if (statusCode !== 200) {
      console.error(chalk.orange("cannot fetch normalize.css"));
      res.resume();
      return;
    }
    res.setEncoding("utf8");
    let rawData = "";
    res.on("data", (chunk) => {
      rawData += chunk;
    });
    res.on("end", () => {
      try {
        const parsedData = rawData;
        fs.writeFileSync(path.resolve(GENERIC_FOLDER, "normalize.css"), parsedData);
        console.log(chalk.green('normalize.css has been written'))
      } catch (e) {
        console.error(chalk.red(e.message));
      }
    });
  }).on('error', (e) => {
    console.error(e)
  });

  if(!fs.existsSync(COMPONENTS_FOLDER)) {
    fs.mkdirSync(COMPONENTS_FOLDER)
  }
  if(!fs.existsSync(ELEMENTS_FOLDER)) {
    fs.mkdirSync(ELEMENTS_FOLDER)
  }
  if(!fs.existsSync(OBJECTS_FOLDER)) {
    fs.mkdirSync(OBJECTS_FOLDER)
  }
  if(!fs.existsSync(UTILITIES_FOLDER)) {
    fs.mkdirSync(UTILITIES_FOLDER)
  }
}

function getInitLayerContent(layer, filename) {
  switch(layer) {
    case "components":
      return `.c-${filename}{}`
    case "elements":
      return `${filename}{}`
    case "objects":
      return `.o-${filename}{}`
    case "utilities":
      return `.u-${filename}{}`
    default:
      return ""
  }
}

program
  .command("init")
  .description("initialize css layers")
  .action(() => {
    if (!fs.existsSync(STYLE_FILE)) {
      setupITCSS();
      console.log(chalk.green('done'))
    } else {
      console.log(chalk.blue("style.css already exist"));
    }
  });

program
  .command("gen-css <name>")
  .description("generates css layer file")
  .option("-l, --layer <layer>", "itcss layer")
  .action((name, options) => {
    if(!isLayerExist(options.layer)) {
      console.log(chalk.red('layer does not exist'))
      process.exit(1)
    }
    fs.writeFileSync(
      path.resolve(ASSETS_CSS_FOLDER, `${options.layer}`, `${name}.css`),
      getInitLayerContent(options.layer, name)
    );
    const styleFileContent = fs.readFileSync(STYLE_FILE, "utf-8");
    const styleArray = styleFileContent.split("\n");
    const layerIdx = styleArray.findIndex(
      (style) => style === `/* ${options.layer} */`
    );
    for (let i = layerIdx; i < styleArray.length; i++) {
      if (styleArray[i] === "/* end */") {
        styleArray.splice(i, 0, `@import "${options.layer}/${name}.css";`);
        break;
      }
    }
    fs.writeFileSync(STYLE_FILE, styleArray.join("\n"));
    console.log(chalk.green("done"));
  });

program
  .command("del-css <name>")
  .description("deletes css file and layer")
  .option("-l, --layer <layer>", "itcss layer")
  .action((name, options) => {
    if(!isLayerExist(options.layer)) {
      console.log(chalk.red('layer does not exist'))
      process.exit(1)
    }
    const filename = path.resolve(
      ASSETS_CSS_FOLDER,
      `${options.layer}`,
      `${name}.css`
    );
    if (!fs.existsSync(filename)) {
      console.log(chalk.red("file does not exist"));
      process.exit(1);
    }
    fs.unlinkSync(filename);
    const styleFileContent = fs.readFileSync(STYLE_FILE, "utf-8");
    const styleArray = styleFileContent.split("\n");
    const layerIdx = styleArray.findIndex(
      (style) => style === `/* ${options.layer} */`
    );
    for (let i = layerIdx; i < styleArray.length; i++) {
      if (styleArray[i] === `@import "${options.layer}/${name}.css";`) {
        styleArray.splice(i, 1);
        break;
      }
    }
    fs.writeFileSync(STYLE_FILE, styleArray.join("\n"));
    console.log(chalk.green("done"));
  });

program.parse(process.argv);
