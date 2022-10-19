gs.log("Start Script Execution", "SF_SCRIPT");

var mainClass = "cmdb_ci_ip_switch";
var mainClassQuery = "discovery_source=ServiceNow";
var subClass = "cmdb_ci_network_adapter";

var getMainCI = new GlideRecord(mainClass);
getMainCI.addEncodedQuery(mainClassQuery);
getMainCI.query();
while (getMainCI.next()) {
  var logMessageCI = "";
  var mainCISysID = getMainCI.getValue("sys_id");
  logMessageCI =
    "Main CI: " +
    getMainCI.getDisplayValue() +
    "|" +
    getMainCI.getValue("sys_id");
  var subList = getSubCIUniqueList(mainCISysID);
  getSubCICount(subClass, subList, mainCISysID);
  gs.log(logMessageCI, "SF-Script");
}

// get unique list of duplicate Sub-CIs for the Main CI based on criteria
function getSubCIUniqueList(mainCISysID) {
  var subCIUniqueList = [];
  var subCIGRs = new GlideRecord(subClass);
  subCIGRs.addQuery("cmdb_ci", mainCISysID); // Query
  subCIGRs.query();
  while (subCIGRs.next()) {
    var subCIName = subCIGRs.getValue("name");
    var arrayUtil = new ArrayUtil();
    if (!arrayUtil.contains(subCIUniqueList, subCIName)) {
      subCIUniqueList.push(subCIName);
    }
  }
  return subCIUniqueList;
}

// For each sub-CI name, check if there are other sub-CIs that share the name
function getSubCICount(subClass, subCIList, mainCISysID) {
  for (var i = 0; i < subCIList.length; i++) {
    var subCI = subCIList[i];
    var queryString = "name=" + subCI + "^cmdb_ci=" + mainCISysID;
    var getsubCIs = new GlideRecord(subClass);
    var subCIs = [];
    getsubCIs.addEncodedQuery(queryString); // Query
    getsubCIs.query();
    while (getsubCIs.next()) {
      subCIs.push(getsubCIs.getValue("sys_id"));
    }
    logMessageCI +=
      "\n Sub CI: " +
      getsubCIs.getValue("name") +
      " has " +
      subCIs.length +
      " records";
  }
}
