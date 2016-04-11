'use strict';

const SwaggerParser = require('swagger-parser')
const ejs = require('ejs')
const rmdir = require('rmdir')
const mkdirp = require("mkdirp")
const fs = require("fs")
const getDirName = require("path").dirname
const colors = require('colors')

const operationTemplate = fs.readFileSync('./templates/operation.ejs', 'utf-8')
const modelTemplate = fs.readFileSync('./templates/model.ejs', 'utf-8')

const operationWritePath = "./Generated/Operations/"
const modelWritePath = "./Generated/Models/"
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

let input = fs.readFileSync('/dev/stdin', 'utf-8')
// console.log(input)
let json = JSON.parse(input)
let models = json.models
let operations = json.operations

// console.log(JSON.stringify(models, null, 2))
// console.log(JSON.stringify(operations, null, 2))

rmdir('./Generated', (error) => {
  
  console.log("-> Parse Start".info)

  operations.forEach((operation) => {
    
    operation.operations.operation.forEach((operation) => {
      console.log("> Operation\n".info)
      let name = escape(operation.path)
      let variables = operation
      prettyJSON(variables)    
      let text = ejs.render(operationTemplate, variables)
    
      let writeFilePath = operationWritePath + name + fileExtension
      writeFile(writeFilePath, text) 
    })      
  })
  
  models.forEach((model) => {
    console.log("> Model\n".info)  
    let name = model.model.name 
    let variables = model
    prettyJSON(variables)
    let text = ejs.render(operationTemplate, variables)  
    let writeFilePath = modelWritePath + name + fileExtension
        writeFile(writeFilePath, text)
  })
  
})