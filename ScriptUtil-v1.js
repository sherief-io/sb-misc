
// ScriptUtil


var ScriptUtil = Class.create();
ScriptUtil.prototype = {
    initialize: function (limit, dryRun, maintable, queryString) {
        this.limit = limit
        this.dryRyn = dryRun
        this.maintable = maintable
        this.queryString = queryString
    },


    // Execute the script
    executeScript: function (tableName, encodedQuery, limit, dryRun) {
        // Get number of records and number of runs
        var jobSize = calculateRepeatCount(tableName, encodedQuery, limit);
        var logMsg = "The Script will run " + jobSize[1] + " time(s), Total number of Records is " + jobSize[0]
        this._setLogMessage(logMsg,null,null)
        // for (var i = 0; i < jobSize[1]; i++) {
        //     // Script Goes here
        //     var NWAdptGR = new GlideRecord(tableName);
        //     NWAdptGR.addEncodedQuery(encodedQuery);
        //     NWAdptGR.query();
        //     while (NWAdptGR.next()) {
        //         if (!dryRun) {
        //             // Execute changes if Dryrun is not TRUE
        //             NWAdptGR.short_description =
        //                 "This is updated from the script on Run number " + i;
        //             NWAdptGR.update();
        //         }
        //     }

        //     gs.log("Script Execution Completed", "SF-FixScript");
        // }

    }


    // Helper functions (start with _)
    // Log message handling 
    _setLogMessage: function (logMsg, msgSrc, logLvl) {
        if (!logMsg) { // If no Log Message return undefined 
            return
        };
        if (!msgSrc) { // If no message source set set or calculate message source from Object name ({objectName}-ScriptUtil)
            msgSrc = 'undefined-ScriptUtil';
        };
        if (!logLvl || logLvl == 'info') {// if no log level is set set to info or log based on log level
            gs.log(logMsg, msgSrc);
        } else if (logLvl == 'warn') {
            gs.logWarning(logMsg, msgSrc);
        } else {
            gs.logError(logMsg, msgSrc);
        };
        return 1
    },
    // Calculate the number of records based on the query amd return Number fo Records and Repeate COunt
    _calculateRepeatCount: function (tableName, encodedQuery, limit) {
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
    },

    // Getters

    type: ScriptUtil
};


var runScript = new ScriptUtil()

