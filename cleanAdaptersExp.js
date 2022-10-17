/* Script: cleanNWAdpts | Version: 1 
    Created for Probe to Pattern Pre-Migration Cleanup */

//************************************ Script Setup ******************************/
/*   Add or delete any of the folllowing setup statments 						 */

var dryRun = true; // Set this to FALSE for the script to delete the records
var dataLimit = 5000; // Set Limit of returned data for testing
var rootTable = "cmdb_ci_computer"; //Root table to act on
var childTable = "cmdb_ci_network_adapter"; // Child table to clean
var discoSourceQuery = [
    "discovery_source=SG-TaniumSN^ORdiscovery_source=SG-SCCM",
    "discovery_source=ServiceNow",
    "discovery_source!=SG-SCCM^ORdiscovery_source!=SG-TaniumSN^ORdiscovery_source!=ServiceNow",
]; 
var completeCIQuery = "mac_addressISNOTEMPTY^nameISNOTEMPTY";
/*******************************************************************************/
gs.log('P2P Fix: Start Cleaning NW Adapters', 'EXP-ProbeToPatternMigration')

// get active computers, Keep Valid adapter and delete the rest 
function getActiveComupter(rootTable) {
    var getActiveComputer = new GlideRecord(rootTable);
    getActiveComputer.addQuery("install_status", "1");
    getActiveComputer.setLimit(dataLimit);
    getActiveComputer.query();
    while (getActiveComputer.next()) {
        var compSysID = getActiveComputer.getValue("sys_id"); // Get sys_id of active computer
        var logString = 'Strating computer ' + compSysID + '\n';
        var adpNameList = getAdptNamesList(compSysID);
        for (var a = 0; a < adpNameList.length; a++) {
            logString += '--Starting Netowrk Adapter --->  ' + adpNameList[a] + '\n'
            
            for (var q = 0; q < discoSourceQuery.length; q++) {
                
                logString += '---- Starting Query ->  ' + discoSourceQuery[q] + '\n'

                var validAdpt;

                if (!validAdpt) {
                    var adptList = getAdptList(compSysID,discoSourceQuery[q],adpNameList[a]);

                    if (adptList == 'false') { // do I have anything returned?
                        logString += '------ No adapters returned for ' + discoSourceQuery[q] + '\n'
                        
                    } else if (isSingleCI(toArray(adptList))) {  // Do I have a single Record
                        validAdpt = adptList;
                        logString += '------ Single adapter  ' + validAdpt + '\n'
                        
                    } else {
                        
                        var completeRecords = checkAdptCompletness(toArray(adptList), completeCIQuery)
                        if (completeRecords == 'false') { //If I dont have any complete records, Keep 1 and delete all
                            gs.print ('FROM MAIN - LINE 53 - Type of complete records is "' + typeof adptList + '" and value is -> ' + adptList );
                            validAdpt = keepOldestRecord(adptList)
                            logString += '------ Valid adapter is ' + validAdpt + '\n'
                            deleteAdpts(toArray(adptList))
                        } else { // If I have complete records, keep 1 and Delete all 
                            gs.print ('FROM MAIN - LINE 59 - Type of complete records is "' + typeof completeRecords + '" and value is -> ' + completeRecords );
                            validAdpt = keepOldestRecord(completeRecords))
                            logString += '------ Valid Adpt is ' + validAdpt + '\n'
                            var arrayUtil  = new ArrayUtil();
                            
                            var allArray = toArray(adptList);
                            var subsetArray = toArray(completeRecords);

                            var deleteArray = arrayUtil.union( allArray, subsetArray)


                            logString += '------- Adapters to be deleted \n ' + deleteArray + '\n ---------- Starting to delete adapter List \n'
                            deleteAdpts(deleteArray) 
                            logString += '---------Adapter List Deleted! '
                        }
                    }            
                } 
            }
        }
        gs.log('P2P Fix: ' + logString, 'EXP-ProbeToPatternMigration')
    }
    gs.log('P2P Fix: Script completed', 'EXP-ProbeToPatternMigration')
}

// Check an array if it has compelte CIs
function checkAdptCompletness(array, completeCIQuery) {
    var completeAdpt;
    for (var a = 0; a < array.length; a++) {
        var checkAdpt = new GlideRecord(childTable);
        checkAdpt.addQuery("sys_id", array[a]);
        checkAdpt.addEncodedQuery(completeCIQuery);
        checkAdpt.sortByDesc("sys_created_on");
        checkAdpt.query();
        while (checkAdpt.next()) {
            if (checkAdpt.name && checkAdpt.mac_address) {
                if (!completeAdpt) {
                    completeAdpt += checkAdpt.getValue("sys_id")
                } else {
                    completeAdpt += ',' + checkAdpt.getValue("sys_id")
                }
            }
        }
    }
    return completeAdpt;
};
// Get adptList for a computer && AdptName
function getAdptList(activeComputer, encodedQuery, adptName) {
    var adptList = [];
    var getAdpt = new GlideRecord(childTable);
    getAdpt.addQuery("name", adptName);
    getAdpt.addQuery("cmdb_ci", activeComputer);
    getAdpt.addEncodedQuery(encodedQuery);
    getAdpt.query();
    while (getAdpt.next()) {
        if(!adptList) { 
            adptList += getAdpt.getValue('sys_id')
        } else {
            adptList += ',' + getAdpt.getValue('sys_id')
        }
    }
    return adptList;
};

// test if the array is a single CI
function isSingleCI(array) {
    if (array.length == 1) {
        validAdpt = array[0];
        return true;
    } else {
        return false;
    }
};

// Remove the first item  and return the array
function keepOldestRecord(array) {
    gs.print( '++++++ KeepOldestRecord Paramter type is "' + typeof array + '" and value is -> ' + array)
    validAdpt = array[0];
    array.shift();
    return array;
} 

// Delete a list of Adapts and updatelog (USES DRYRUN)
function deleteAdpts(array) {
    for (var x = 0; x <= array.length; x++) {
        var deleteAdpts = new GlideRecord(childTable);
        deleteAdpts.addQuery("sys_id", array[x]);
        deleteAdpts.query();
        while (deleteAdpts.next()) {
            if (!dryRun) {
                deleteAdpts.setWorkFlow(false);
                deleteAdpts.deleteRecord();
            }
        }
    }
}

// Get unique adapter names
function getAdptNamesList(compSysID) {
    var adptNames = [];
    var getAdptNames = new GlideRecord(childTable);
    getAdptNames.addQuery("cmdb_ci", compSysID);
    getAdptNames.query();
    while (getAdptNames.next()) {
        adptName = getAdptNames.getValue("name");
        var arrayUtil = new ArrayUtil();
        if (!arrayUtil.contains(adptNames, adptName)) {
            adptNames.push(adptName);
        }
    };
    return adptNames;
}

// Run the script 
getActiveComupter(rootTable);


//=====================  Helper Functions  ============
// Convert comma-delimited list to Array 
function toArray(stringList) {
    return stringList.split(',');  
};