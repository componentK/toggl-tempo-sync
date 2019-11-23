#!/bin/bash

# You can copy this to your bash script and run from terminal
# Define directory where your module resides if called from outside
TOGGL_DIR='./'
toggl() {
    ORIG_DIR=$PWD
    cd ${TOGGL_DIR}
    npm start -- \
        ${1:+ --from=$1} \
        ${2:+ --to=$2}
    cd ${ORIG_DIR}
    unset ORIG_DIR
}

toggl
