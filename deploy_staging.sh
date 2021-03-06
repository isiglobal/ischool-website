#!/bin/bash 
# Sync to the staging and testing environment
shopt -s expand_aliases
alias rsync="rsync -zrpvu -e ssh --exclude-from=exclude.txt --progress"

function print_status() {
	status=$1
	length=${#1}
	echo ''
	echo $status
	for i in $(seq $length); do echo -n '-'; done
	echo ''
}

print_status 'Running build script'
python build.py

#
# DREAMHOST DYNAMIC STAGING
#

#print_status 'Running rsync to isi.isimobile.com'
#rsync . isiglobal@isimobile.com:/home/isiglobal/isi.isimobile.com/flaskapp

#print_status 'Restarting Python on isi.isimobile.com'
#ssh -n -f isiglobal@isimobile.com "sh -c 'touch isi.isimobile.com/tmp/restart.txt'"

#
#
# GODADDY (ugh) STATIC STAGING
#

print_status 'Running rsync /output/final/ -> staging.ischoolinitiative.org'
rsync --rsync-path=~/bin/rsync ./output/final/ ischooltravis@ischoolinitiative.org:html/staging

print_status 'Running rsync to staging.isimobile.com/static'
rsync --rsync-path=~/bin/rsync ./static/ ischooltravis@ischoolinitiative.org:html/staging/static

