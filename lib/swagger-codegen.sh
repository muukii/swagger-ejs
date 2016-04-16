#!/bin/sh

java -DcleanDebugInfo -DdebugModels -DdebugOperations -Dmodels -Dapis -jar swagger-codegen-cli-2.1.6.jar generate \
-i Swagger.yml \
-t templates \
-l swift \
--type-mappings long=Int64 \
--language-specific-primitives Int16,Int32,Int64,NSDate
