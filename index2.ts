/// <reference path="typings/main.d.ts" />

import SwaggerParser from "swagger-parser";
import fs from "fs";
import ejs = require('ejs')
import rmdir = require('rmdir')
import mkdirp = require("mkdirp")
import getDirName = require("path").dirname
import colors = require('colors')

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
        
        console.log("\n")
        console.log("> Path: ".info + path.info)
        console.log("\n")
        
        let pathObject = api.paths[path]
        let name = escape(path)
        
        let variables = {info: info, path: pathObject, name : name}
        
        console.log(JSON.stringify(variables, null, 2))
        
        let pathCode = ejs.render(pathTemplate, variables)
        
        let writeFilePath = pathWritePath + name + fileExtension
        
        writeFile(writeFilePath, pathCode)
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

