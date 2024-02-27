#!/bin/sh

# Recreate config file
rm -rf ./env.js
touch ./env.js

# Add assignment 
echo "window._env_ = {" >> ./env.js
echo "  GATSBY_API_URL: \"${GATSBY_API_URL}\"," >> ./env.js
echo "}" >> ./env.js