#!/bin/bash
sublocation='site'
submodule_name="${sublocation}/notes"

# Remove the submodule entry from .git/config file
git config -f --quiet .git/config --remove-section submodule.${submodule_name}

# Remove the submodule entry from .gitmodules file
rm -f .gitmodules

# Remove the cached information about the module files
git rm --cached --quiet ${submodule_name}

# Delete relevant git objects
rm -rf .git/modules/${submodule_name}
rm -rf .git/modules/${site}

# Finally delete the directory if it exists
rm -rf site/notes
