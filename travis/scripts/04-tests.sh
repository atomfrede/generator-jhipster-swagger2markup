#!/bin/bash
set -e

#-------------------------------------------------------------------------------
# Launch tests
#-------------------------------------------------------------------------------
cd "$APP_FOLDER"
if [ -f "mvnw" ]; then
    ./mvnw test \
        swagger2markup:convertSwagger2markup install
    ls -al target/asciidoc/ target/asciidoc/html5/
elif [ -f "gradlew" ]; then
    ./gradlew \
        asciidoctor --console plain
    ls -al build/asciidoc/ build/asciidoc/html5/
fi
