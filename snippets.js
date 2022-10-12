/// ------------------------------------------------------------------;
//  Default Variables
var tableName = "cmdb_ci_network_adapter";
var encodedQuery = "install_status=1";
var limit = 3;
var dryRun = true;
// ------------------------------------------------------------------;

function runScript(tableName, encodedQuery, limit, dryRun) {
  // Get number of records and number of runs
  var jobSize = calculateRepeatCount(tableName, encodedQuery, limit);
  gs.log(
    "The Script will run " +
      jobSize[1] +
      " time(s), Total number of Records is " +
      jobSize[0],
    "SF-FixScript"
  );

  for (var i = 0; i < jobSize[1]; i++) {
    // Script Goes here
    var NWAdptGR = new GlideRecord(tableName);
    NWAdptGR.addEncodedQuery(encodedQuery);
    NWAdptGR.query();
    while (NWAdptGR.next()) {
      if (!dryRun) {
        // Execute changes if Dryrun is not TRUE
        NWAdptGR.short_description =
          "This is updated from the script on Run number " + i;
        NWAdptGR.update();
      }
    }
  }
  gs.log("Script Execution Completed", "SF-FixScript");
}

// Calculate the number of records based on the query amd return Number fo Records and Repeate COunt
function calculateRepeatCount(tableName, encodedQuery, limit) {
  var outputArray = [];
  //Get Record count based on the query
  var recordCount = new GlideAggregate(tableName);
  recordCount.addEncodedQuery(encodedQuery);
  recordCount.addAggregate("COUNT", "sys_mod_count");
  recordCount.query();
  while (recordCount.next()) {
    recordCount = recordCount.getAggregate("COUNT", "sys_mod_count");
    outputArray.push(recordCount);
  }
  // Calculate number of Runs based on Limit
  var repeatCount = Math.round(recordCount / limit);
  outputArray.push(repeatCount);
  // Return an array Record Count & Repeat Count
  return outputArray;
}

// gs.print(calculateRepeatCount(tableName, encodedQuery, limit));

runScript(tableName, encodedQuery, limit, dryRun);


var testclass = Class.create();
testclass.prototype = {
initialize: function() {
},



type: testclass
};