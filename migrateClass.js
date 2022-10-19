//  migrateCIs - Version 1.0
//  inputs @initialClass @targetClass @encodedQuery
//  Outputs none

var initialClass = "u_cmdb_ci_wireless_lan_controller";
var targetClass = "cmdb_ci_ip_switch";
var encodedQuery = "";

function migrateCIs(initialClass, targetClass, encodedQuery) {
  var ciGR = new GlideRecord(initialClass);
  ciGR.addEncodedQuery(encodedQuery); // Query
  ciGR.query();
  while (ciGR.next()) {
    ciGR.setValue("sys_class_name", targetClass);
    ciGR.update();
  }
  return;
}
migrateCIs(initialClass, targetClass, encodedQuery);
