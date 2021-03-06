"use strict";

const program = require('commander')
const path = require('path')
const cmd = require('node-cmd')
const gen = require('./swagger-codegen.js').gen
const spawn = require('child_process').spawn

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
    // console.log(program)
    // console.log(command);

    var modelTemplate = program.model_template
    var operationTemplate = program.operation_template

    const runJava = spawn('java', [
      '-DcleanDebugInfo',
      '-DdebugModels',
      '-DdebugOperations',
      '-Dmodels',
      '-Dapis',
      '-jar', jarPath,
      'generate',
      '-i', program.input,
      '-t', 'temlates',
      '-l', 'swift',
      '--type-mappings', 'long=Int64,date=String',
      '--language-specific-primitives', 'Int16,Int32,Int64,NSDate'
    ])

    var result = ''
    runJava.stdout.on('data', (data) => {
      result += data.toString()
    })

    runJava.stderr.on('data', (data) => {
      console.log(`stderr: ${data}`);
    })

    runJava.on('close', (code) => {
      
      console.log(`child process exited with code ${code}`);

      gen(result, program.output, modelTemplate, operationTemplate)

      let cpCmd = 'cp ' + path.join(__dirname, './utils/SwiftyJSON+Util.swift') + ' ' + program.output + '/SwiftyJSON+Util.swift'
      cmd.run(cpCmd)

      let rmCmd = 'rm -r ./SwaggerClient'
      cmd.run(rmCmd)
    })
};
