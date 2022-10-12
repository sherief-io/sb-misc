var encodedQuery = "cmdb_ci.nameSTARTSWITHPEP-VENE-600-CS01-FCW2032C1AH";
var tableName = "cmdb_ci_network_adapter";

var NWAdptGR = new GlideRecord(tableName);
NWAdptGR.addEncodedQuery(encodedQuery);
NWAdptGR.query();
while (NWAdptGR.next()) {
  NWAdptGR.deleteRecord();
}
