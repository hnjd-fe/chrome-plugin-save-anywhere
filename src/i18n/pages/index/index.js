
const lang = {
    "en": {

		//common
		"databaseLabel": "database:"
		, "dataTableLabel": "table:"
		, "totalLabel": "total items:"
		, "curTotalLabel": "current query items:"

		//index
		, "note": "notes"
		, "updateDate": "latest update"
		, "operation": "operation"
		, "modify": "modify"
		, "delete": "delete"

		//setting
        , "language": "Language:"
        , "devmode": "Develop Mode:"
        , "devmodeDesc": "display development mode configuration"
        , "version": "vsersion:"

		//import/export
		, "backupData": "backup datatabse"
        , "backupingInfo": "backup in progress, please waiting..."
        , "backupNowInfo": "data backup now, please waiting..."
        , "backupSuccessInfo": "congratulation! data backup success."
        , "backupErrorInfo": "data backup failed."

		, "restoreData": "restore database"
		, "restoreDataDesc": "only file of .json"
		, "cleanData": "clear data"
        , "importingInfo": "restore data in progress, please waiting..."
        , "importNowInfo": "restoring data, please waiting..."
        , "importSuccessInfo": "congratulation! restore data success."
        , "importErrorInfo": "restore data failed"
        , "fileEmptyInfo": "file is empty!"
        , "dataEmptyInfo": "file has no data!"

		//data manage
		, "generateDataLabel": "producing test data"
        , "producingDataInfo": "data product in progress, please waiting..."
        , "productDataNowInfo": "producing data, please waiting..."
        , "productDataSuccessInfo": "congratulation! data product done."
        , "productDataErrorInfo": "could't prodcut data!"

		, "cleanAllData": "clean all data"
        , "cleaningDataInfo": "cleaning data in progress, please waiting..."
        , "cleanDataNowInfo": "cleaning data, please waiting..."
        , "cleanDataSuccessInfo": "congratulation! data cleaned."
        , "cleanDataErrorInfo": "could't clean data!"

        , "fixmd5": "fix md5 field"
        , "fixmd5ingDataInfo": "fixmd5ing data in progress, please waiting..."
        , "fixmd5DataNowInfo": "fixmd5ing data, please waiting..."
        , "fixmd5DataSuccessInfo": "congratulation! data fixmd5ed."
        , "fixmd5DataErrorInfo": "could't fixmd5 data!"

        , "fixdate": "fix date field"
        , "fixdateingDataInfo": "fixdateing data in progress, please waiting..."
        , "fixdateDataNowInfo": "fixdateing data, please waiting..."
        , "fixdateDataSuccessInfo": "congratulation! data fixdateed."
        , "fixdateDataErrorInfo": "could't fixdate data!"
    }
    , "zh": {

		//common
		"databaseLabel": "数据库:"
		, "dataTableLabel": "数据表:"
		, "totalLabel": "数据总数:"
		, "curTotalLabel": "当前查询总数:"

		//index
		, "note": "文摘"
		, "updateDate": "更新日期"
		, "operation": "操作"
		, "modify": "修改"
		, "delete": "删除"

		//setting
        , "language": "选择语言:"
        , "devmode": "开发者模式"
        , "devmodeDesc": "显示开发者功能"
        , "version": "当前版本:"

		//import/export
		, "backupData": "生成备份文件"
        , "backupingInfo": "数据备份中，请稍候..."
        , "backupNowInfo": "数据正在备份，请稍候..."
        , "backupSuccessInfo": "恭喜你，数据备份成功"
        , "backupErrorInfo": "数据备份失败"

		, "restoreData": "从备份文件恢复"
		, "restoreDataDesc": "只能恢复.josn文件"
		, "cleanData": "清空数据"
        , "importingInfo": "数据导入中，请稍候..."
        , "importNowInfo": "数据正在导入，请稍候..."
        , "importSuccessInfo": "恭喜你，数据导入成功"
        , "importErrorInfo": "数据导入失败"
        , "fileEmptyInfo": "导入的文件不能为空"
        , "dataEmptyInfo": "导入的数据不能为空"

		//data manage
		, "generateDataLabel": "生成数据"
        , "producingDataInfo": "数据生成中，请稍候..."
        , "productDataNowInfo": "正在生成数据，请稍候..."
        , "productDataSuccessInfo": "恭喜你，数据生成成功"
        , "productDataErrorInfo": "无法生成数据"

		, "cleanAllData": "清空数据"
        , "cleaningDataInfo": "数据清空中，请稍候..."
        , "cleanDataNowInfo": "数据正在清空，请稍候..."
        , "cleanDataSuccessInfo": "数据已经清空"
        , "cleanDataErrorInfo": "无法清空数据"

        , "fixmd5": "修复 md5 字段"
        , "fixmd5ingDataInfo": "md5 字段修复中，请稍候..."
        , "fixmd5DataNowInfo": "正在修复 md5 字段"
        , "fixmd5DataSuccessInfo": "恭喜你，md5 字段修复完成"
        , "fixmd5DataErrorInfo": "无法修复 md5 字段"

        , "fixdate": "修复 date 字段"
        , "fixdateingDataInfo": "date 字段修复中，请稍候..."
        , "fixdateDataNowInfo": "正在修复 date 字段"
        , "fixdateDataSuccessInfo": "恭喜你，date 字段修复完成"
        , "fixdateDataErrorInfo": "无法修复 date 字段"
    }
}

module.exports = lang;
