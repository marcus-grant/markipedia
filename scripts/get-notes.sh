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

# if [ ! -f .gitmodules ]; then
#     printf '[submodule "site/notes"]\n' >> .gitmodules
#     printf '\tpath = site/notes\n' >> .gitmodules
#     printf "\turl = $NOTES_URL\n" >> .gitmodules
# fi

echo "Adding notes submodule..."
echo "Has URL of $NOTES_URL"

git submodule add $NOTES_URL site/notes

# git submodule foreach git pull