'use strict';

let SwaggerParser = require('swagger-parser');
let ejs = require('ejs');

let sampleSwagger = "./Swagger.yml"

console.log("Validate")
SwaggerParser.validate(sampleSwagger)
  .then(function(api) {
    console.log("API name: %s, Version: %s", api.info.title, api.info.version);
  })
  .catch(function(err) {
    console.error(err);
  });

console.log("parse")

SwaggerParser.parse(sampleSwagger)
  .then(function(api) {
    console.log(api)
    console.log(api.paths)
    
    let html = ejs.render("<%= api.info.title %>", {api:api})
    console.log(html)
  })
  .catch(function(err) {
    console.error(err);
  });