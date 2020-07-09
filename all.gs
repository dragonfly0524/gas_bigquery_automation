//自分のProjectNumberを入れてやってください。
var projectNumber = 'findy-186703';
var ss = SpreadsheetApp.getActiveSpreadsheet();

//SQLとか、出力セルを入力するシート
var master_sheet = ss.getSheetByName('master');

//SQLの結果を出力するシート
var sheet_name = ['①','②','③','④','⑤','⑥','⑦','⑧','⑨','⑩','⑪','⑫','⑬']
var query = ['B2','B3','B4','B5','B6','B7','B8','B9','B10','B11','B12','B13','B14']
var row = ['C2','C3','C4','C5','C6','C7','C8','C9','C10','C11','C12','C13','C14']
var column= ['D2','D3','D4','D5','D6','D7','D8','D9','D10','D11','D12','D13','D14']

function onRunQuery() {
  delTrigger();

  for(var k = 0; k < sheet_name.length ; k++){

  var result_sheet = ss.getSheetByName(sheet_name[k]);

  var sql = master_sheet.getRange(query[k]).getValue();
  var start_row = master_sheet.getRange(row[k]).getValue();
  var start_column = master_sheet.getRange(column[k]).getValue();

  var del_col = 100;
  var del_row = 1000;
  result_sheet.getRange(start_row,start_column,del_row,del_col).clear();
  result_sheet.getRange(start_row,start_column,del_row,del_col).clearFormat();
  result_sheet.getRange(start_row,start_column,del_row,del_col).clearDataValidations();


  var query_results;
  var resource = {
    query : sql,
    timeoutMs: 1000000
  };

  try {
    query_results = BigQuery.Jobs.query(resource, projectNumber);
  }
  catch (err) {
    Logger.log(err);
    Browser.msgBox(err);
    return;
  }
  while (query_results.getJobComplete() == false) {
    try {
      query_results = BigQuery.Jobs.getQueryResults(projectNumber, queryResults.getJobReference().getJobId());
      if (query_results.getJobComplete() == false) {
        Utilities.sleep(3000);
      }
    }
    catch (err) {
      Logger.log(err);
      Browser.msgBox(err);
      return;
    }
  }

  var resultCount = query_results.getTotalRows();
  var resultSchema = query_results.getSchema();

  var resultValues = new Array(resultCount);
  var tableRows = query_results.getRows();

  for (var i = 0; i < tableRows.length; i++) {
    var cols = tableRows[i].getF();
    resultValues[i] = new Array(cols.length);
    for (var j = 0; j < cols.length; j++) {
      resultValues[i][j] = cols[j].getV();
    }
  }
  result_sheet.getRange(start_row,start_column,resultCount,tableRows[0].getF().length).setValues(resultValues).setBorder(true,true,true,true,true,true);
  }
}