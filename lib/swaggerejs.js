"use strict";

let program = require('commander')
let cmd = require('node-cmd')
let gen = require('./swagger-codegen.js').gen

module.exports.run = () => {
    program
      .version('1.0.0')
      .option('-i, --input [path]', 'input Swagger file path', 'input')
      .option('--model_template [path]', 'Add model template', 'modelTemplate')
      .option('--operation_template [path]', 'Add operation template', 'operationTemplate')
      .option('-o, --output [path]', 'Add output Path', 'output')
      .parse(process.argv);

    // if (!program.input ||
    //     !program.modelTemplate ||
    //     !program.operationTemplate ||
    //     !program.output) {
    //       console.log("invalid args")
    // }
    let command = "java -DcleanDebugInfo -DdebugModels -DdebugOperations -Dmodels -Dapis -jar lib/swagger-codegen-cli-2.1.6.jar generate \
                    -i " + program.input + " \
                    -t templates \
                    -l swift \
                    --type-mappings long=Int64 \
                    --language-specific-primitives Int16,Int32,Int64,NSDate"
    console.log(command)
    cmd.get(command, (data) => {
      gen(data)
    })
};
