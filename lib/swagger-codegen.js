'use strict';

module.exports.gen = (swaggerJSON, output, modelTemplatePath, operationTemplatePath) => {
  console.log(modelTemplatePath);
  console.log(operationTemplatePath);

  const SwaggerParser = require('swagger-parser')
  const ejs = require('ejs')
  const rmdir = require('rmdir')
  const mkdirp = require("mkdirp")
  const fs = require("fs")
  const getDirName = require("path").dirname
  const colors = require('colors')

  const operationTemplate = fs.readFileSync(operationTemplatePath, 'utf-8')
  const modelTemplate = fs.readFileSync(modelTemplatePath, 'utf-8')

  const operationWritePath = output + "/Operations/"
  const modelWritePath = output + "/Models/"
  const fileExtension = ".swift"

  function writeFile(path, contents) {
    mkdirp(getDirName(path), function (err) {
      if (err) return
      fs.writeFileSync(path, contents)
    })
  }

  function escape(string) {
      var string = string
      string = string.replace("{","_")
      string = string.replace("}","_")
      let array = string.split("/")
      if (array[0] == string) {
          return string
      }
      var name = ""
      for (var i in array) {
          var path = array[i]
          path = path.charAt(0).toUpperCase() + path.slice(1);
          name = name + path
      }
      return name
  }

  function prettyJSON(object) {
    console.log(JSON.stringify(object, null, 2))
  }

  colors.setTheme({
    silly: 'rainbow',
    input: 'grey',
    verbose: 'cyan',
    prompt: 'grey',
    info: 'green',
    data: 'grey',
    help: 'cyan',
    warn: 'yellow',
    debug: 'blue',
    error: 'red'
  });

  console.log("> Launch SwaggerGen\n".info)
  console.log("> Clean up...\n".info)

  console.log(swaggerJSON)
  let json = JSON.parse(swaggerJSON ||  null)

  console.log(json)
  let models = json.models
  let operations = json.operations

  console.log("-> Parse Start".info)
  // console.log(operations)
  operations.forEach((operation) => {

    operation.operations.operation.forEach((operation) => {
      console.log("> Operation\n".info)
      let name = escape(operation.path)
      var variables = operation
      variables.name = name
      // prettyJSON(variables)
      let text = ejs.render(operationTemplate, variables)

      let writeFilePath = operationWritePath + name  + '_operation' + fileExtension
      writeFile(writeFilePath, text)
    })
  })

  models.forEach((model) => {
    console.log("> Model\n".info)
    let name = model.model.name
    let variables = model
    variables.name = name
    prettyJSON(variables)
    let text = ejs.render(modelTemplate, variables)
    // console.log(operationTemplate)
    // console.log(text)
    let writeFilePath = modelWritePath + name + '_model' + fileExtension
        writeFile(writeFilePath, text)
  })
}
