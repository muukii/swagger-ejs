'use strict';

const SwaggerParser = require('swagger-parser')
const ejs = require('ejs')
const rmdir = require('rmdir')
const mkdirp = require("mkdirp")
const fs = require("fs")
const getDirName = require("path").dirname

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
    console.log(array)
    var name = ""
    for (var i in array) {
        var path = array[i]
        path = path.charAt(0).toUpperCase() + path.slice(1);
        name = name + path
    }
    return name
}



console.log("-> Clean up...")

rmdir('./Generated', (error) => {
  console.log("-> Parse Start")

SwaggerParser.parse(sampleSwagger)
  .then((api) => {
    
    let info = {
      swaggerVersion : api.swagger,
      apiVersion : api.info.version,
      title : api.info.title,
      host : api.host,
      schemes : api.schemes
    }
                     
    console.log("### " + sampleSwagger + " ###")
    
    console.log(info)
           
    console.log("### Paths ###")
    for (var path in api.paths) {
      console.log("-" + path)
      let pathObject = api.paths[path]
      let name = escape(path)
      
      let variables = {info: info, path: pathObject, name : name}
      
      console.log(variables)
      
      let pathCode = ejs.render(pathTemplate, variables)
      
      let writeFilePath = pathWritePath + name + fileExtension
      
      writeFile(writeFilePath, pathCode)
    }
    
    console.log("### Definitions ###")
    for (var definition in api.definitions) {
      console.log("-" + definition)      
      
      let difinitionObject = api.definitions[definition]
      let name = escape(definition)
      let variables = {info: info, definition: difinitionObject, name : name}
      
      console.log(variables)

      let modelCode = ejs.render(modelTemplate, variables)      
      let writeFilePath = modelWritePath + name + fileExtension
      writeFile(writeFilePath, modelCode)
    }
    
  })
  .catch((err) => {
    console.error(err)
  })
})

