'use strict';
// http://swagger.io/specification/
function typeToSwift(properties) {
  var p = properties
  if (p["$ref"] != null) {
    
    return 
  }
  
  if (p["type"] != null && p["format"] != null) { 
    var type = p["type"]
    
  }

  if (p["type"] != null) {
    
    switch (p["type"]) {
      case 'integer':
        return 'Int32'      
    }
  }
}
