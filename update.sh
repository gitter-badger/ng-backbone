#!/bin/bash
cur=`pwd`
dir=`mktemp -d`
cd $dir
echo "Downloading dependencies..."
npm i ng-template
npm i ng-aspect

echo "Copying dependencies to ./src ..."
cp node_modules/ng-aspect/aspect.ts $cur/src/
cp node_modules/ng-template/src/ngtemplate.ts $cur/src/
cp node_modules/ng-template/src/ngtemplate.d.ts $cur/src/
cp -r node_modules/ng-template/src/ng-template $cur/src/

echo "Cleaning up..."
rm -rf $dir
cd $cur

echo "Done!"
