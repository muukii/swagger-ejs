'use strict';

let SwaggerParser = require('swagger-parser')
let ejs = require('ejs')
let rmdir = require('rmdir')
let mkdirp = require("mkdirp")
let fs = require("fs")
let getDirName = require("path").dirname

let sampleSwagger = "./Swagger.yml"
let pathTemplate = fs.readFileSync('./templates/path.ejs', 'utf-8')
let modelTemplate = fs.readFileSync('./templates/model.ejs', 'utf-8')

let pathWritePath = "./Generated/Paths"
let modelWritePath = "./Generated/Models"
let fileExtension = ".swift"

function writeFile (path, contents) {
  mkdirp(getDirName(path), function (err) {
    if (err) return
    fs.writeFileSync(path, contents)
  })
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
      let pathCode = ejs.render(pathTemplate, {info: info, path: pathObject})
      
      let writeFilePath = pathWritePath + path + fileExtension
      
      writeFile(writeFilePath, pathCode)
    }
    
    console.log("### Definitions ###")
    for (var definition in api.definitions) {
      console.log("-" + definition)      
      let modelCode = ejs.render(modelTemplate, {info: info, path: path})
      
      let writeFilePath = modelWritePath + path + fileExtension
      writeFile(writeFilePath, modelCode)
    }
    
  })
  .catch((err) => {
    console.error(err)
  })
})

