#!/bin/bash

if ! git diff --name-only $TRAVIS_COMMIT_RANGE | grep -qP '(test/|examples/|package\.json)'
then
  echo "Examples files were not updated, not running example regression tests."
  exit
fi

TEST_DIRS=$(git diff --name-only $TRAVIS_COMMIT_RANGE | grep -oP 'test/tests/\K[\w-]+(?=_)' | uniq)
EXAMPLE_DIRS=$(git diff --name-only $TRAVIS_COMMIT_RANGE | grep -oP 'examples/\K[\w-]+(?=/)' | uniq)

# Only add match args if the example/js or example/css directories or test/index.hs
# or the test/utils.js directories have not been edited

TEST_INFRA=$(git diff --name-only $TRAVIS_COMMIT_RANGE | grep -oP 'test/(util|index)')
EXAMPLE_INFRA=$(echo "$EXAMPLE_DIRS" | grep -P '^(js|css)$')

ARGS=''

if [ -z $TEST_INFRA ] && [ -z $EXAMPLE_INFRA ]
then
  for D in $EXAMPLE_DIRS
  do
    ARGS="${ARGS} --match ${D}/*"
  done

  for F in $TEST_DIRS
  do
    ARGS="${ARGS} --match ${F}/*"
  done
fi

AVACMD="npm run regression -- -t -c 1 test/tests ${ARGS}"
echo "$ $AVACMD"

$AVACMD
