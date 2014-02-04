#!/bin/bash
#
# Generate and Deploy script

echo ""
echo "Ensure that you started Ghost with 'npm start' before running this script"
echo "Press Enter to continue or CTRL-C to exit"
echo ""
read TEMP

buster generate --domain=http://local.areskibelaid.com:2368
cp -rf extra/* static/
find static/. -type f -print0 | xargs -0 sed -i 's/local.areskibelaid.com/areskibelaid.com/g'
buster deploy

