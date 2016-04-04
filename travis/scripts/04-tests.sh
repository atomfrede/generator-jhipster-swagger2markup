#!/bin/bash
set -ev
#--------------------------------------------------
# Launch tests
#--------------------------------------------------
cd "$HOME"/"$JHIPSTER"
if [ "$JHIPSTER" != "app-gradle" ]; then
  mvn test swagger2markup:process-swagger install
else
  ./gradlew asciidoctor
fi
