#!/bin/bash
set -ev
#-------------------------------------------------------------------------------
# Generate the default audit behaviour
#-------------------------------------------------------------------------------
cd "$APP_FOLDER"
npm link generator-jhipster-swagger2markup
yo jhipster-swagger2markup default --force --no-insight
