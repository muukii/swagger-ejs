"use strict";

let program = require('commander')
let cmd = require('node-cmd')
// let gen = require('./swagger-codegen.js')

module.exports.run = () => {
    program
      .version('1.0.0')
      .option('-i, --input', 'input Swagger file path', 'input')
      .option('--model_template', 'Add bbq sauce', 'modelTemplate')
      .option('--operation_template', 'Add bbq sauce', 'operationTemplate')
      .option('-o, --output [path]', 'output')
      .parse(process.argv);

    // if (!program.input ||
    //     !program.modelTemplate ||
    //     !program.operationTemplate ||
    //     !program.output) {
    //       console.log("invalid args")
    // }
    cmd.get(
      "ls", (data) => {
      console.log(data)
    })
    let command = "java -DcleanDebugInfo -DdebugModels -DdebugOperations -Dmodels -Dapis -jar swagger-codegen-cli-2.1.6.jar generate \
  -i Swagger.yml \
  -t templates \
  -l swift \
  --type-mappings long=Int64 \
  --language-specific-primitives Int16,Int32,Int64,NSDate"

    console.log(command)

    cmd.get(
      "java -DcleanDebugInfo -DdebugModels -DdebugOperations -Dmodels -Dapis -jar swagger-codegen-cli-2.1.6.jar generate \
    -i Swagger.yml \
    -t templates \
    -l swift \
    --type-mappings long=Int64 \
    --language-specific-primitives Int16,Int32,Int64,NSDate", (data) => {
      console.log(data)
    })
};
