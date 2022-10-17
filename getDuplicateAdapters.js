var mainClass = "cmdb_ci_ip_switch";
var mainClassQuery =
  "manufacturer=c6592abadb47138071957608f49619ce^discovery_source=ServiceNow";
var subClass = "cmdb_ci_network_adapter";

var getMainCI = new GlideRecord(mainClass);
getMainCI.addEncodedQuery(mainClassQuery);
getMainCI.query();
while (getMainCI.next()) {
  swSysID = getMainCI.getValue("sys_id");
}

// get unique list of adapter names for a switch
function getSwitchAdapters(swSysID) {
  var getSwAdpts = new GlideRecord(subClass);
  getSwAdpts; // Query
  getSwAdpts.query();
  while (getSwAdpts.next()) {
    getSwAdpts; // Do What
  }
}

// For each name, check if there are other adapters that share the name

//

function getSwitch(switchSysID) {}
