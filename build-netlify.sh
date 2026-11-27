#!/bin/bash

set -e

if [ -d "wai-aria-practices" ]; then
    echo "wai-aria-practices directory already exists. Removing..."
    rm -rf wai-aria-practices
fi

echo "Cloning wai-aria-practices repository"
git clone --depth 1 --branch main https://github.com/w3c/wai-aria-practices wai-aria-practices

if [ -d "wai-aria-practices/_external/aria-practices" ]; then
  echo "Removing aria-practices directory..."
  rm -rf "wai-aria-practices/_external/aria-practices"
fi

mkdir wai-aria-practices/_external/aria-practices

# Copy aria-practices files
echo "Copying aria-practices files..."
rsync -a --exclude node_modules --exclude wai-aria-practices ./ wai-aria-practices/_external/aria-practices/

# Update site files
echo "Updating site files..."
cd wai-aria-practices
npm install -C scripts/pre-build
node ./scripts/pre-build

# Build Jekyll site
echo "Building Jekyll site..."
bundle install
bundle update wai-website-theme --conservative
bundle update wai-website-plugin --conservative
bundle exec jekyll build --config '_config.yml,_config_staging.yml'
