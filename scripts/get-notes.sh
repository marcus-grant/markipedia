#!/bin/bash

if [ -z $NOTES_GH_TOKEN ]; then
    if [ -f "$HOME/.zshenv" ]; then
        source "$HOME/.zshenv"
    else
        echo "ERROR: No Github Token in variable NOTES_GH_TOKEN"
        exit 1
    fi
fi

ME='marcus-grant'
NOTES_URL="https://${ME}:${NOTES_GH_TOKEN}@github.com/${ME}/notes.git"

if [ ! -f .gitmodules ]; then
    printf '[submodule "site/notes"]\n' >> .gitmodules
    printf '    path = ./site/notes\n' >> .gitmodules
    printf "    url = $NOTES_URL\n" >> .gitmodules
fi

git submodule foreach git pull