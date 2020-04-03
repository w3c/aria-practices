#!/bin/bash

cp examples/index.html examples/index.tmp.html &&
npm run build &&
diff examples/index.html examples/index.tmp.html
rv=$?
cp examples/index.tmp.html examples/index.html
rm examples/index.tmp.html
[ $rv -ne 0 ] && echo 'Please generate examples/index.html by running: npm run build'
exit $rv
