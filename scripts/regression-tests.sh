#!/bin/bash

if [[ "$CI" != "true" ]]
then
  # When running this script locally, compare the current branch to master
  COMMIT_RANGE="..main"
fi

AVACMD="npm run regression -- -t"
ARGS=''

TEST_FILES=$(git diff --name-only $COMMIT_RANGE | grep -oP 'test/tests/\K.*' | uniq)
TEST_INFRA=$(git diff --name-only $COMMIT_RANGE | grep -oP 'test/(util|index)')

EXAMPLE_DIRS=$(git diff --name-only $COMMIT_RANGE | grep -oP 'examples/\K[\w-]+(?=/)' | uniq)
EXAMPLE_INFRA=$(echo "$EXAMPLE_DIRS" | grep -P '^(js|css)$')

PACKAGE_UPDATE=$(git diff --name-only $COMMIT_RANGE | grep -P 'package(-lock)?\.json')

if [[ $TEST_INFRA || $EXAMPLE_INFRA || $PACKAGE_UPDATE ]]
then

    # If the example/js or example/css directories or the test/index.js or the test/utils.js
    # or the package.json files have been edited, run all tests.

    ARGS="test/tests/*.js"

else

  # Otherwise, run only relevant tests

  for D in $EXAMPLE_DIRS
  do
    # Remove this if statement when we add regression tests for landmark pages
    if [[ $D != 'landmarks' ]]
    then
      ARGS="${ARGS} test/tests/${D}*.js"
    fi
  done

  for F in $TEST_FILES
  do
    ARGS="${ARGS} test/tests/${F}"
  done
fi

# If there are no arguments, no regression test relevant files have been edited
if [[ -z $ARGS ]]
then
  echo "Examples files were not updated, not running example regression tests."
  exit
fi

echo "$" $AVACMD $ARGS

$AVACMD $ARGS
