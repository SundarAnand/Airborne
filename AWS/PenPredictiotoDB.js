exports.handler = (event, context, callback) => {
    // TODO implement
    // Libraries importing
    //console.log("Starting...");

    // Load the AWS SDK for Node.js
    var AWS = require("aws-sdk");
    var docClient = new AWS.DynamoDB.DocumentClient();
    var resp;
    
    var params = {
        TableName:"resultFromAWSML",
        KeyConditionExpression: "Valid = :valid",
        ExpressionAttributeValues: {
        ':valid': "1"
        }
    };
    
    
     
    console.log("Just outside scan function");
    //Scaning the entire connected table   
    docClient.query(params, function(err, data) {
        if (err) {
            console.log("Error found - No data found");
            callback(err, null);
        } else {
            console.log(data);
            resp=data.Items;
            console.log("resp is " + resp);
        if(resp=="S"){
            
            console.log("Hello");
            var returnresult = "";
        var params = {
            
            TableName:"SPdb",
            KeyConditionExpression: "Valid = :valid",
            ScanIndexForward: false,
            ExpressionAttributeValues: {
            ':valid': 1
            },
            Limit:1
        };
            
        
            
         //console.log("Just outside scan function");
        //Scaning the entire connected table   
        docClient.query(params, function(err, data) {
            if (err) {
                console.log("Error found - No data found");
                callback(err, null);
            } else {
                
                //console.log(data);
                returnresult = data;
                //console.log("The Returnresult is ");
                //console.log(returnresult);
                //callback(null,returnresult);
                //console.log("Hello : " + returnresult.Items.Data);
                //console.log("Hi : " + (returnresult.Items.Sno)+1) ;               
                var params = {
                    TableName:"SPdb",
                    Item:{
                        "Valid": 1,
                        "Sno": (returnresult.Items[0].Sno)+1,
                        //"Latitude": lat,
                        //"Longtiude": long
                        "Data":returnresult.Items[0].Data
                    },
            
                };
                //console.log("Done with params");
                //console.log("Adding a new item...");
                docClient.put( params, function(err, data) {
                if (err) {
                    console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
                } else {
                    console.log("Added item:", JSON.stringify(data, null, 2));
                }
            });
            }
        });
        
        var params = {
                TableName:"resultFromAWSML",
                Key:{
                    "Valid": "1",
                }
                
            };
            
            console.log("Attempting a conditional delete...");
            docClient.delete(params, function(err, data) {
                if (err) {
                    console.error("Unable to delete item. Error JSON:", JSON.stringify(err, null, 2));
                } else {
                    console.log("DeleteItem succeeded:", JSON.stringify(data, null, 2));
                }
            });
            
        }
        else{
        console.log("resp is " + resp);
        var returnresult = "";
        var params = {
            
            TableName:"SPdb",
            KeyConditionExpression: "Valid = :valid",
            ExpressionAttributeValues: {
            ':valid': 1
        }
            
        };
            
         //console.log("Just outside scan function");
        //Scaning the entire connected table   
        docClient.query(params, function(err, data) {
            if (err) {
                console.log("Error found - No data found");
                callback(err, null);
            } else {
                
                //console.log(data);
                returnresult = data;
                console.log("The Returnresult is ");
                console.log(returnresult);
                //console.log("Entering into params");
                var params = {
                    TableName:"SPdb",
                    Item:{
                        "Valid": 1,
                        "Sno": returnresult.Count+1,
                        //"Latitude": lat,
                        //"Longtiude": long
                        "Data":resp 
                    },
            
                };
                //console.log("Done with params");
                //console.log("Adding a new item...");
                docClient.put(params, function(err, data) {
                if (err) {
                    console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
                } else {
                    console.log("Added item:", JSON.stringify(data, null, 2));
                }
            });
        
            }
        });
            
        }
        }
        });
         
    }   