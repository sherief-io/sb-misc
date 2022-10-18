var mainClass = "cmdb_ci_ip_switch";
var mainClassQuery =
  "manufacturer=c6592abadb47138071957608f49619ce^discovery_source=ServiceNow";
var subClass = "cmdb_ci_network_adapter";

var getMainCI = new GlideRecord(mainClass);
getMainCI.addEncodedQuery(mainClassQuery);
getMainCI.query();
while (getMainCI.next()) {
  mainCISysID = getMainCI.getValue("sys_id");
}

// get unique list of duplicate Sub-CIs for the Main CI based on criteria
function getSubCIs(mainCISysID) {
  var subCIList = [];
  var getSubCIs = new GlideRecord(subClass);
  getSubCIs.addQuery("cmdb_ci", ciSysID); // Query
  getSubCIs.query();
  while (getSubCIs.next()) {
    if (!subCIList) {
      subCIList += getSubCIs.getValue("sys_id");
    } else {
      subCIList += "," + getSubCIs.getValue("sys_id");
    }
  }
  return subCIList;
}

// For each sub-CI name, check if there are other sub-CIs that share the name
function getSubCICount(subClass, subCIIdentifier, mainCISysID) {}
//

function getSwitch(switchSysID) {}
