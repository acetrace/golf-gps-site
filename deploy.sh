#!/usr/bin/env sh

set -e
npm run build
cd dist

echo 'golfgps.ai' > CNAME

git init
git checkout -b main
git add -A
git commit -m 'deploy'

# if you are deploying to https://<USERNAME>.github.io/<REPO>
git push -f git@github.com:acetrace/golf-gps-site.git main:gh-pages

cd -