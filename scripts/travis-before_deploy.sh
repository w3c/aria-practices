#!/bin/bash

# Stash the latest examples
mkdir /tmp/aria-practices
cp -R common /tmp/aria-practices
cp -R examples /tmp/aria-practices
cp -R img /tmp/aria-practices
cp .gitignore /tmp/aria-practices
cp .editorconfig /tmp/aria-practices
cp README.md /tmp/aria-practices

mkdir /tmp/deploy
cp scripts/travis-deploy.sh /tmp/deploy/

# Grab the gh-pages branch
git fetch --depth=1 origin gh-pages:gh-pages
git checkout gh-pages
curl "https://labs.w3.org/spec-generator/?type=respec&url=https://raw.githack.com/${TRAVIS_REPO_SLUG}/master/aria-practices.html" -o index.html -f --retry 3

# Clean and update the examples
rm -rf common/
rm -rf examples/
rm -rf img/
cp -R /tmp/aria-practices/ ..
