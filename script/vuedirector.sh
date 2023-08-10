#!/usr/bin/env node

BRed='\033[1;31m'
BGreen='\033[1;92m'
BBlue='\033[1;34m'

Name="$(node -pe "require('./package.json').name")"
NewVersion="latest"
Version=""
Component=false
Composable=false
Store=false
Args=$*

argParser () {
  NameStatus=false
  VersionStatus=false

  for arg in $Args
  do
    if $NameStatus; then
      Name=$arg
      NameStatus=false
    elif $VersionStatus; then
      Version=$arg
      VersionStatus=false
    else
      case $arg in
        "-c" | "component")
          Component=true
          ;;

        "-f" | "composable")
          Composable=true
          ;;

        "-s" | "store")
          Store=true
          ;;

      esac
    fi
  done
}

argGuard () {
  if ($Component && $Composable) ||  ; then
    echo -e "${BRed} -d && -m cannot be together"
    exit 0
  fi

  if $Master; then
    updateVersion
  fi
}


init () {
  argParser
  argGuard
  checkingMode 
  createPlace
  dockerBuild
  if $Backup ; then
    createBackupPlace
    backup
  fi
}

init