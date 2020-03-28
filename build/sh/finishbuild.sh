rm -rf ./fqt-todo/icons*/manifest.* 
cp -rf ./src/chrome ./fqt-todo 
cp -rf ./src/_locales ./fqt-todo/
cp -rf ./src/manifest.json ./fqt-todo/manifest.json

mkdir -p ./fqt-todo/assets
cp -rf ./src/assets/img ./fqt-todo/assets

cp -rf ./fqt-todo/index.html ./fqt-todo/sync.html
cp -rf ./fqt-todo/index.html ./fqt-todo/importExport.html
cp -rf ./fqt-todo/index.html ./fqt-todo/dataManage.html
cp -rf ./fqt-todo/index.html ./fqt-todo/setting.html
