#!/bin/bash
set -e

cat /usr/share/nginx/html/osago-loader.template.js | envsubst > /usr/share/nginx/html/osago-loader.js
cat /usr/share/nginx/html/partner-loader.template.js | envsubst > /usr/share/nginx/html/partner-loader.js
