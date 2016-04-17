"use strict";

const program = require('commander')
const path = require('path')
const cmd = require('node-cmd')
const gen = require('./swagger-codegen.js').gen

module.exports.run = () => {
    program
      .version('1.0.0')
      .option('-i, --input [path]', 'input Swagger file path', 'input')
      .option('--model_template [path]', 'Add model template', path.join(__dirname, "./templates/model.ejs"))
      .option('--operation_template [path]', 'Add operation template', path.join(__dirname, "./templates/operation.ejs"))
      .option('-o, --output [path]', 'Add output Path', 'output')
      .parse(process.argv);

      if (!program.input) {
        console.log("Missing required arguments [-i]")
        return
      }
      if (!program.output) {
        console.log("Missing required arguments [-o]")
        return
      }

    // if (!program.input ||
    //     !program.modelTemplate ||
    //     !program.operationTemplate ||
    //     !program.output) {
    //       console.log("invalid args")
    // }
    console.log(path.resolve("./lib/model.ejs"));
    let jarPath = path.join(__dirname, './swagger-codegen-cli-2.1.6.jar')
    let command = "java -DcleanDebugInfo -DdebugModels -DdebugOperations -Dmodels -Dapis -jar " + jarPath + " generate \
                    -i " + program.input + " \
                    -t templates \
                    -l swift \
                    --type-mappings long=Int64 \
                    --language-specific-primitives Int16,Int32,Int64,NSDate"
    console.log(program)
    cmd.get(command, (data) => {
      console.log(data);
      var modelTemplate = program.model_template
      var operationTemplate = program.operation_template
      gen(data, program.output, modelTemplate, operationTemplate)
      cmd.get("cp ./utils/SwiftyJSON+Util.swift " + program.output + "/SwiftyJSON+Util.swift", (data) => {

      })
    })
};
