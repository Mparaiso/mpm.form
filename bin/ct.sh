#!/usr/bin/env sh

make test

ret=$?

while [ $ret == 0 ]; do
  make test
  ret=$?
done
