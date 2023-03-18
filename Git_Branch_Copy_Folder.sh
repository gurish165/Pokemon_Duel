#!/bin/bash

# Check if two arguments were provided
if [ "$#" -ne 2 ]; then
  echo "Usage: ./shellscript copy_from_branch path/to/your/folder"
  echo "This command will copy a folder from copy_from_branch to your current branch"
  exit 1
fi

# Set the first argument as the branch name
branch="$1"

# Set the second argument as the folder path
folder="$2"

# Run the git checkout command
git checkout "$branch" -- "$folder"
