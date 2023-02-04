#!/bin/sh

# Check if site/notes exists
if [ ! -d site/notes ]; then
    echo "site/notes does not exist"
    echo ""
fi