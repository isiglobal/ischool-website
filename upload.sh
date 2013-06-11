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

print_status 'Compiling LESS'
lessc --yui-compress static/less/design.less > output/final/static/design.out.css

print_status 'Running rsync to isi.isimobile.com'
rsync . isiglobal@isimobile.com:/home/isiglobal/isi.isimobile.com/flaskapp

print_status 'Restarting Python on isi.isimobile.com'
ssh -n -f isiglobal@isimobile.com "sh -c 'touch isi.isimobile.com/tmp/restart.txt'"

print_status 'Running rsync /output/final/ -> staging.isimobile.com'
rsync ./output/final/ isiglobal@isimobile.com:/home/isiglobal/staging.isimobile.com

print_status 'Running rsync to staging.isimobile.com/static'
rsync ./static/ isiglobal@isimobile.com:/home/isiglobal/staging.isimobile.com/static

