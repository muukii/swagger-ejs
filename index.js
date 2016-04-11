'use strict';

const SwaggerParser = require('swagger-parser')
const ejs = require('ejs')
const rmdir = require('rmdir')
const mkdirp = require("mkdirp")
const fs = require("fs")
const getDirName = require("path").dirname
const colors = require('colors')

const sampleSwagger = "./Swagger.yml"
const pathTemplate = fs.readFileSync('./templates/path.ejs', 'utf-8')
const modelTemplate = fs.readFileSync('./templates/model.ejs', 'utf-8')

const pathWritePath = "./Generated/Paths/"
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

var input = fs.readFileSync('/dev/stdin', 'utf-8')
let infos = input.split(/############.+?############/) // #### Model Info ###
console.log(infos.length)
console.log(infos)
let modelInfo = infos[1]
let operationInfo = infos[2]

console.log(modelInfo)

let model = JSON.parse(modelInfo)
let operation = JSON.parse(operationInfo) 

// console.log(model)
// console.log(infos)

return

rmdir('./Generated', (error) => {
  console.log("-> Parse Start".info)
  SwaggerParser.parse(sampleSwagger)
    .then((api) => {
    
      let info = {
        swaggerVersion : api.swagger,
        apiVersion : api.info.version,
        title : api.info.title,
        host : api.host,
        schemes : api.schemes
      }
                      
      console.log("###" + sampleSwagger + "###\n".info)
      
      console.log("\n")
      console.log(info)
      console.log("\n")

      console.log("###Paths###\n".info)
      
      for (var path in api.paths) {  
        let pathObject = api.paths[path]
              
        for (var method in pathObject) {
          console.log(method)
          let methodObject = pathObject[method]
          console.log("\n")
          console.log("> Path: ".info + path.info)
          console.log("\n")
            
          
          let name = escape(path)
           
          let variables = {info: info, path: path, method: method, methodObject: methodObject, name : name}
           
          console.log(JSON.stringify(variables, null, 2))
            
          let pathCode = ejs.render(pathTemplate, variables)
            
          let writeFilePath = pathWritePath + name + fileExtension
            
          writeFile(writeFilePath, pathCode)
        }
      }
      
      console.log("###Definitions###".info)
      for (var definition in api.definitions) {
        
        console.log("\n")        
        console.log("> Definition: ".info + definition.info)   
        console.log("\n")   
        
        let difinitionObject = api.definitions[definition]
        let name = escape(definition)
        let variables = {info: info, definition: difinitionObject, name : name}
        
        console.log(JSON.stringify(variables, null, 2))

        let modelCode = ejs.render(modelTemplate, variables)      
        let writeFilePath = modelWritePath + name + fileExtension
        writeFile(writeFilePath, modelCode)
      }
      
    })
    .catch((err) => {
      console.error(err)
    })
})

