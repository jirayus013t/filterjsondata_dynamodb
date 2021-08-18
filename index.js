const express = require('express')
const app = express()
var port = process.env.PORT || 3339;
var func = require('./function')
var path = require('path');
const https = require('https');
const http = require('http');
const { timeStamp } = require('console');
const e = require('express');
var standard = require('./standard')
var _ = require('lodash');
const { each } = require('lodash');
const { json } = require('express');


//URL that data has been taken from dynamodb
var riceInspectProcessingUrl = "https://4skomnp9df.execute-api.ap-southeast-1.amazonaws.com/default/Gafrana_get_data_RiceInferenceProcessing"
var listInference = "http://13.212.86.129:3000/listInference"



//Find all unique users new function

Array.prototype.contains = function(v) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] === v) return true;
  }
  return false;
};

Array.prototype.unique = function() {
  var arr = [];
  for (var i = 0; i < this.length; i++) {
    if (!arr.contains(this[i])) {
      arr.push(this[i]);
    }
  }
  return arr;
}



var queryURL2 = "http://localhost:3339/query/?&Status=All&revert=1"
var querytableURL2 = "http://localhost:3339/query_table_riceinspectprocessing"

var queryData_Weekly = "http://localhost:3339/query_timerange_weekly/?starttime=2021-01-01T00:00:00&endtime=now"
var queryData_Daily = "http://localhost:3339/query_timerange_daily/?starttime=2021-01-01T00:00:00&endtime=now"
var queryData_Monthly = "http://localhost:3339/query_timerange_monthly/?starttime=2021-01-01T00:00:00&endtime=now"



//For production auto loop
function initData() {
  http.get(querytableURL2)
  console.log("querytableURL2 is executed")
  setTimeout(function(){ 
    http.get(queryURL2) 
    console.log("queryURL2 is executed")
  }, 5000);
}
initData()



////////////////////
/*
  if(range == "1h"){
    timerange = 3600000
  }else if(range == "1d"){
    timerange = 86400000
  }else if(range == "1w"){
    timerange = 604800000
  }else if(range == "1m"){
    timerange = 2592000000
  }else{
    timerange = 3600000
  }
  */

http.get(queryData_Weekly)
http.get(queryData_Daily)
http.get(queryData_Monthly)
setInterval(function(){ http.get(queryData_Weekly) }, 86400000);
setInterval(function(){ http.get(queryData_Daily) }, 86400000);
setInterval(function(){ http.get(queryData_Monthly) }, 86400000);


app.get('/update_data_listinference', function(req, res) {
  initData()
  res.json("Update data listinference function has been executed")
});


app.get('/update_data_RiceInferenceProcessing', function(req, res) {
  initData()
  res.json("Update data RiceInspectProcessing function has been executed")
});



app.get('/get_table_riceinspectprocessing', function(req, res) {
  res.json(table_riceInspectProcessing);
});



// get table from riceinspectprocessing

var table_riceInspectProcessing =
  {
    columns: [{text: 'Data and Time', type: 'time'}, {text: 'Server ID', type: 'number'}, {text: 'Username', type: 'string'}, 
    {text: 'Standard', type: 'string'}, {text: 'Status', type: 'string'}, {text: 'riceTypeTH', type: 'string'}],
    rows: [
      [ 1234567, 'SE', 123 ],
      [ 1234567, 'DE', 231 ],
      [ 1234567, 'US', 321 ],
    ]
  };




app.get('/query_table_riceinspectprocessing', function(req, res) {

  let url = listInference;

  http.get(url,(res) => {
      let body = "";
  
      res.on("data", (chunk) => {
          body += chunk;
      });
      res.on("end", () => {
          try {    
              let json = JSON.parse(body); 
              table_riceInspectProcessing.rows = []   
              // do something with JSON by filtering riceInspectProcessing data
              for (i = 0; i < json.data.length; i++) {

                table_riceInspectProcessing.rows.push([
                  new Date(json.data[i].myDate).getTime(), 
                  json.data[i].serverID,
                  json.data[i].username,
                  json.data[i].standardName,
                  json.data[i].Status,
                  json.data[i].riceTypeName
                ])  
                             
              }
                           
          } catch (error) {
              console.log("This is the part where it is error");
              console.error(error.message);
          };
      });      
  }).on("error", (error) => {
      console.error(error.message);
      
  });
  res.json(table_riceInspectProcessing);
})






app.get('/', function(req, res) {
  res.json("Hello world");
});



app.get('/grafana/allriceinspectprocessing', (req, res) => {
  res.json(riceinspectprocessinglist)
  
})


app.get('/grafana/allriceinspectprocessing_usernametimestamp', (req, res) => {

  res.json(username_timestamp)
  
})

app.get('/grafana/filtercontent', (req, res) => {

  res.json(filterContent)
  
})

app.get('/grafana/listricetypename', (req, res) => {
  res.json(riceType_timestamp)
  
})

app.get('/grafana/liststandard', (req, res) => {
  res.json(standardTimestamp)
  
})


app.get('/grafana/liststandard_homrice', (req, res) => {
  res.json(standardTimestamp_homRice)
  
})

app.get('/grafana/liststandard_hommalirice', (req, res) => {
  res.json(standardTimestamp_homMaliRice)
  
})


//Weekly Query
app.get('/grafana/get_query', (req, res) => {
  res.json(milIDStructure)
})

//Daily Query
app.get('/grafana/get_query_daily', (req, res) => {
  res.json(milIDStructure_Daily)
})

//Monthly Query
app.get('/grafana/get_query_monthly', (req, res) => {
  res.json(milIDStructure_Monthly)
})

//------------------------------Daily, Monthly, and weekly (Weekly)------------------------------//

var milIDStructure
app.get('/query_timerange_weekly/', function(req, res) {
  var startTime = req.query.starttime
  var endTime = req.query.endtime 
  let url = listInference;
  var timerange 
  
  /*
  if(range == "1h"){
    timerange = 3600000
  }else if(range == "1d"){
    timerange = 86400000
  }else if(range == "1w"){
    timerange = 604800000
  }else if(range == "1m"){
    timerange = 2592000000
  }else{
    timerange = 3600000
  }
  */
  timerange = 604800000

  http.get(url,(res) => {
      let body = "";
    
      res.on("data", (chunk) => {
          body += chunk;
      });
      res.on("end", () => {
          try { 
              let json = JSON.parse(body);
              
              let fakeArray = []
              let currentTimeUnix = new Date(startTime).getTime()
              let endTimeUnix = new Date(endTime).getTime()
              let currentTimeUnixPrev
              let iteration


              if(endTime=="now"){
                endTimeUnix = Date.now()
              }
              
              // Collect all miller name into list and make it unique
              let millIDList = []
              _.each(json.data, function(i){
                  if(i.username != null){
                    millIDList.push(i.username)
                  }           
              });
              millIDList = [...new Set(millIDList)];
             
              //Initiate Structure
              milIDStructure = []
              _.each(millIDList, function(t){
                let struc = 
                {
                  "target": t,
                  "datapoints": [
                          
                  ]
                }
                milIDStructure.push(struc)
              })
              //console.log(milIDStructure)

              //test
              _.each(json.data, function(inside) {
                
                if(new Date(inside.myDate).getTime()  >= currentTimeUnix & new Date(inside.myDate).getTime()  <= endTimeUnix ){
                  
                  let tmp = {
                    "username": inside.username,
                    "date":  new Date(inside.myDate).getTime() 
                  }
                  fakeArray.push(tmp) 
                }
                
              });
              //console.log(fakeArray)



              async function prepareData(usernameInput){
                //console.log("----------Username = "+usernameInput)
                currentTimeUnix = new Date(startTime).getTime()
                

                while(currentTimeUnix<=endTimeUnix){
                  iteration = 0
                  currentTimeUnixPrev = currentTimeUnix
                  currentTimeUnix += timerange
                  //console.log(currentTimeUnixPrev + " ----------- "+currentTimeUnix + " ------ limit: " + endTimeUnix + " timerange: "+timerange)
                  
                  _.each(fakeArray, function(t){
                    if(t.date >= currentTimeUnixPrev && t.date <= currentTimeUnix && t.username == usernameInput){
                      //console.log("++++ " +  t.date  + "  :iteration : " + iteration)
                      iteration += 1
                    }
                  });
                  //console.log("Summation = "+iteration)  
                  

                  if(currentTimeUnix>endTimeUnix){
                    _.each(milIDStructure, function(i){
                      if(i.target == usernameInput){
                        i.datapoints.push([iteration, endTimeUnix])
                      }
                    });
                  }else{
                    _.each(milIDStructure, function(i){
                      if(i.target == usernameInput){
                        i.datapoints.push([iteration, currentTimeUnix])
                      }
                    });
                  }
                  
                                    
              }
              
              }
              //Loop through every miller and prepare indivudual data for each miller
              _.each(millIDList, function(t){
                prepareData(t)
              });
              
                                
          } catch (error) {
              console.log("This is the part where it is error");
              console.error(error.message);
          };
      });      
  }).on("error", (error) => {
      console.error(error.message);
      
  });
  res.json(milIDStructure);
})



//------------------------------Daily, Monthly, and weekly (Daily)------------------------------//

var milIDStructure_Daily
app.get('/query_timerange_daily/', function(req, res) {
  var startTime = req.query.starttime
  var endTime = req.query.endtime 
  let url = listInference;
  var timerange 
  
  /*
  if(range == "1h"){
    timerange = 3600000
  }else if(range == "1d"){
    timerange = 86400000
  }else if(range == "1w"){
    timerange = 604800000
  }else if(range == "1m"){
    timerange = 2592000000
  }else{
    timerange = 3600000
  }
  */
  timerange = 86400000

  http.get(url,(res) => {
      let body = "";
    
      res.on("data", (chunk) => {
          body += chunk;
      });
      res.on("end", () => {
          try { 
              let json = JSON.parse(body);
              
              let fakeArray = []
              let currentTimeUnix = new Date(startTime).getTime()
              let endTimeUnix = new Date(endTime).getTime()
              let currentTimeUnixPrev
              let iteration


              if(endTime=="now"){
                endTimeUnix = Date.now()
              }
              
              // Collect all miller name into list and make it unique
              let millIDList = []
              _.each(json.data, function(i){
                  if(i.username != null){
                    millIDList.push(i.username)
                  }           
              });
              millIDList = [...new Set(millIDList)];
             
              //Initiate Structure
              milIDStructure_Daily = []
              _.each(millIDList, function(t){
                let struc = 
                {
                  "target": t,
                  "datapoints": [
                          
                  ]
                }
                milIDStructure_Daily.push(struc)
              })
              //console.log(milIDStructure_Daily)

              //test
              _.each(json.data, function(inside) {
                
                if(new Date(inside.myDate).getTime()  >= currentTimeUnix & new Date(inside.myDate).getTime()  <= endTimeUnix ){
                  
                  let tmp = {
                    "username": inside.username,
                    "date":  new Date(inside.myDate).getTime() 
                  }
                  fakeArray.push(tmp) 
                }
                
              });
              //console.log(fakeArray)



              async function prepareData(usernameInput){
                //console.log("----------Username = "+usernameInput)
                currentTimeUnix = new Date(startTime).getTime()
                

                while(currentTimeUnix<=endTimeUnix){
                  iteration = 0
                  currentTimeUnixPrev = currentTimeUnix
                  currentTimeUnix += timerange
                  //console.log(currentTimeUnixPrev + " ----------- "+currentTimeUnix + " ------ limit: " + endTimeUnix + " timerange: "+timerange)
                  
                  _.each(fakeArray, function(t){
                    if(t.date >= currentTimeUnixPrev && t.date <= currentTimeUnix && t.username == usernameInput){
                      //console.log("++++ " +  t.date  + "  :iteration : " + iteration)
                      iteration += 1
                    }
                  });
                  //console.log("Summation = "+iteration)  
                  

                  if(currentTimeUnix>endTimeUnix){
                    _.each(milIDStructure_Daily, function(i){
                      if(i.target == usernameInput){
                        i.datapoints.push([iteration, endTimeUnix])
                      }
                    });
                  }else{
                    _.each(milIDStructure_Daily, function(i){
                      if(i.target == usernameInput){
                        i.datapoints.push([iteration, currentTimeUnix])
                      }
                    });
                  }
                  
                                    
              }
              
              }
              //Loop through every miller and prepare indivudual data for each miller
              _.each(millIDList, function(t){
                prepareData(t)
              });
              
                                
          } catch (error) {
              console.log("This is the part where it is error");
              console.error(error.message);
          };
      });      
  }).on("error", (error) => {
      console.error(error.message);
      
  });
  res.json(milIDStructure_Daily);
})


//------------------------------Daily, Monthly, and weekly (Monthly)------------------------------//

var milIDStructure_Monthly
app.get('/query_timerange_monthly/', function(req, res) {
  var startTime = req.query.starttime
  var endTime = req.query.endtime 
  let url = listInference;
  var timerange 
  
  /*
  if(range == "1h"){
    timerange = 3600000
  }else if(range == "1d"){
    timerange = 86400000
  }else if(range == "1w"){
    timerange = 604800000
  }else if(range == "1m"){
    timerange = 2592000000
  }else{
    timerange = 3600000
  }
  */
  timerange = 2592000000

  http.get(url,(res) => {
      let body = "";
    
      res.on("data", (chunk) => {
          body += chunk;
      });
      res.on("end", () => {
          try { 
              let json = JSON.parse(body);
              
              let fakeArray = []
              let currentTimeUnix = new Date(startTime).getTime()
              let endTimeUnix = new Date(endTime).getTime()
              let currentTimeUnixPrev
              let iteration


              if(endTime=="now"){
                endTimeUnix = Date.now()
              }
              
              // Collect all miller name into list and make it unique
              let millIDList = []
              _.each(json.data, function(i){
                  if(i.username != null){
                    millIDList.push(i.username)
                  }           
              });
              millIDList = [...new Set(millIDList)];
             
              //Initiate Structure
              milIDStructure_Monthly = []
              _.each(millIDList, function(t){
                let struc = 
                {
                  "target": t,
                  "datapoints": [
                          
                  ]
                }
                milIDStructure_Monthly.push(struc)
              })
              //console.log(milIDStructure_Monthly)

              //test
              _.each(json.data, function(inside) {
                
                if(new Date(inside.myDate).getTime()  >= currentTimeUnix & new Date(inside.myDate).getTime()  <= endTimeUnix ){
                  
                  let tmp = {
                    "username": inside.username,
                    "date":  new Date(inside.myDate).getTime() 
                  }
                  fakeArray.push(tmp) 
                }
                
              });
              //console.log(fakeArray)



              async function prepareData(usernameInput){
                //console.log("----------Username = "+usernameInput)
                currentTimeUnix = new Date(startTime).getTime()
                

                while(currentTimeUnix<=endTimeUnix){
                  iteration = 0
                  currentTimeUnixPrev = currentTimeUnix
                  currentTimeUnix += timerange
                  //console.log(currentTimeUnixPrev + " ----------- "+currentTimeUnix + " ------ limit: " + endTimeUnix + " timerange: "+timerange)
                  
                  _.each(fakeArray, function(t){
                    if(t.date >= currentTimeUnixPrev && t.date <= currentTimeUnix && t.username == usernameInput){
                      //console.log("++++ " +  t.date  + "  :iteration : " + iteration)
                      iteration += 1
                    }
                  });
                  //console.log("Summation = "+iteration)  
                  

                  if(currentTimeUnix>endTimeUnix){
                    _.each(milIDStructure_Monthly, function(i){
                      if(i.target == usernameInput){
                        i.datapoints.push([iteration, endTimeUnix])
                      }
                    });
                  }else{
                    _.each(milIDStructure_Monthly, function(i){
                      if(i.target == usernameInput){
                        i.datapoints.push([iteration, currentTimeUnix])
                      }
                    });
                  }
                  
                                    
              }
              
              }
              //Loop through every miller and prepare indivudual data for each miller
              _.each(millIDList, function(t){
                prepareData(t)
              });
              
                                
          } catch (error) {
              console.log("This is the part where it is error");
              console.error(error.message);
          };
      });      
  }).on("error", (error) => {
      console.error(error.message);
      
  });
  res.json(milIDStructure_Monthly);
})

//--------------------------------------------------list and filterstandard for whiteRiceStandard--------------------//

var test = []
var standardTimestamp = [] 
app.get('/query_listStandardName/', function(req, res) {
  var username = req.query.username
  var standardType = req.query.standard
  let url = listInference;

  
  http.get(url,(res) => {
      let body = "";
  
      res.on("data", (chunk) => {
          body += chunk;
      });
      res.on("end", () => {
          try {    
              let json = JSON.parse(body); 
              test = []
              standardTimestamp =[]
              // do something with JSON by filtering riceInspectProcessing data
              _.each(json.data, function(inside) {
                
                if(inside.username == username){
                  var k = _.filter(standard[standardType], function(t) {
                      return t == inside.standardName
                  });
                }
                
                _.each(k,function(kk){
                  test.push(kk+"_"+username)
                })
                
                
              });
              console.log(test)
              standardNameUnique_all = test.unique();
              console.log(standardNameUnique_all);

              _.each(standardNameUnique_all, function(i) {
                myObj = {
                  "target": i,
                  "datapoints": [
                       
                  ]
                }
                standardTimestamp.push(myObj);  
              })

              console.log(standardTimestamp)
              

              _.each(json.data, function(inside) {
                if(inside.username == username){
                  //To check whether the created json structure (standardTimestamp) username is match with inference url or not
                  _.each(standardTimestamp, function(j) {
                    if(inside.standardName+"_"+inside.username == j.target){
                      j.datapoints.push([1, new Date(inside.myDate).getTime()])
                    }
                  })
                }
              })
             console.log(standardTimestamp)
            
                        
          } catch (error) {
              console.log("This is the part where it is error");
              console.error(error.message);
          };
      });      
  }).on("error", (error) => {
      console.error(error.message);
      
  });
  res.json(standardTimestamp);
})



//--------------------------------------------------list and filterstandard for homRiceStandard--------------------//

var test_homRice = []
var standardTimestamp_homRice = [] 
app.get('/query_listStandardName/homrice', function(req, res) {
  var username = req.query.username
  var standardType = req.query.standard
  let url = listInference;
  
  http.get(url,(res) => {
      let body = "";
  
      res.on("data", (chunk) => {
          body += chunk;
      });
      res.on("end", () => {
          try {    
              let json = JSON.parse(body); 
              test_homRice = []
              standardTimestamp_homRice =[]
              // do something with JSON by filtering riceInspectProcessing data
              _.each(json.data, function(inside) {

                if(inside.username == username){
                  var k = _.filter(standard[standardType], function(t) {
                      return t == inside.standardName
                  });
                }
                
                _.each(k,function(kk){
                  test_homRice.push(kk+"_"+username)
                })
                
                
              });
              console.log(test_homRice)
              standardNameUnique_all = test_homRice.unique();
              console.log(standardNameUnique_all);

              _.each(standardNameUnique_all, function(i) {
                myObj = {
                  "target": i,
                  "datapoints": [
                       
                  ]
                }
                standardTimestamp_homRice.push(myObj);  
              })

              console.log(standardTimestamp_homRice)
              

              _.each(json.data, function(inside) {
                if(inside.username == username){
                  //To check whether the created json structure (standardTimestamp_homRice) username is match with inference url or not
                  _.each(standardTimestamp_homRice, function(j) {
                    if(inside.standardName+"_"+inside.username == j.target){
                      j.datapoints.push([1, new Date(inside.myDate).getTime()])
                    }
                  })
                }
              })
             console.log(standardTimestamp_homRice)
            
                        
          } catch (error) {
              console.log("This is the part where it is error");
              console.error(error.message);
          };
      });      
  }).on("error", (error) => {
      console.error(error.message);
      
  });
  res.json(standardTimestamp_homRice);
})






//--------------------------------------------------list and filterstandard for hommaliRiceStandard--------------------//

var test_homMaliRice = []
var standardTimestamp_homMaliRice = [] 
app.get('/query_listStandardName/hommalirice', function(req, res) {
  var username = req.query.username
  var standardType = req.query.standard
  let url = listInference;
  
  http.get(url,(res) => {
      let body = "";
  
      res.on("data", (chunk) => {
          body += chunk;
      });
      res.on("end", () => {
          try {    
              let json = JSON.parse(body); 
              test_homMaliRice = []
              standardTimestamp_homMaliRice =[]
              // do something with JSON by filtering riceInspectProcessing data
              _.each(json.data, function(inside) {

                if(inside.username == username){
                  var k = _.filter(standard[standardType], function(t) {
                      return t == inside.standardName
                  });
                }
                
                _.each(k,function(kk){
                  test_homMaliRice.push(kk+"_"+username)
                })
                
                
              });
              console.log(test_homMaliRice)
              standardNameUnique_all = test_homMaliRice.unique();
              console.log(standardNameUnique_all);

              _.each(standardNameUnique_all, function(i) {
                myObj = {
                  "target": i,
                  "datapoints": [
                       
                  ]
                }
                standardTimestamp_homMaliRice.push(myObj);  
              })

              console.log(standardTimestamp_homMaliRice)
              

              _.each(json.data, function(inside) {
                if(inside.username == username){
                  //To check whether the created json structure (standardTimestamp_homMaliRice) username is match with inference url or not
                  _.each(standardTimestamp_homMaliRice, function(j) {
                    if(inside.standardName+"_"+inside.username == j.target){
                      j.datapoints.push([1, new Date(inside.myDate).getTime()])
                    }
                  })
                }
              })
             console.log(standardTimestamp_homMaliRice)
            
                        
          } catch (error) {
              console.log("This is the part where it is error");
              console.error(error.message);
          };
      });      
  }).on("error", (error) => {
      console.error(error.message);
      
  });
  res.json(standardTimestamp_homMaliRice);
})








//--------------------------------------------------list and filterRiceType--------------------//

//Filter unique riceTypeName and push into form
var riceTypeArray = []
var riceTypeUnique_all
var riceType_timestamp = []

app.get('/query_listRiceTypeName', function(req, res) {
  var username = req.query.username
  let url = listInference;

  http.get(url,(res) => {
      let body = "";
  
      res.on("data", (chunk) => {
          body += chunk;
      });
      res.on("end", () => {
          try {    
              let json = JSON.parse(body); 
              riceTypeArray = []
              riceType_timestamp = []
              // do something with JSON by filtering riceInspectProcessing data
              for (i = 0; i < json.data.length; i++) {
                if(json.data[i].username+"_ricetype" == username){
                  //colect all riceTypeName including duplicate riceTypeName for specific user
                  /*
                  if(json.data[i].riceTypeName != null){
                    riceTypeArray.push(json.data[i].riceTypeName+"_"+json.data[i].username)
                  }
                  */
                  riceTypeArray.push(json.data[i].riceTypeName+"_"+json.data[i].username)
              }
            }
            // Add new set of non-duplicate riceTypeName into riceTypeUnique_all
            //console.log(riceTypeArray)
            riceTypeUnique_all = riceTypeArray.unique();
            console.log(riceTypeUnique_all);


            //----------------------Finalize process putting riceTypeName in fakesimplejsondatasource Structure----------------//
            //----------------------Initiate mock up riceTypeName structure--------//
            for(i=0;i<riceTypeUnique_all.length; i++){

              myObj = {
                "target": riceTypeUnique_all[i],
                "datapoints": [
                     
                ]
              }
              riceType_timestamp.push(myObj);  
            }

            //loop through endpointURL again and Push time info into datapoints of targets
            
            for(i = 0; i < json.data.length; i++){
              if(json.data[i].username+"_ricetype" == username){
                //console.log(json.data[i].riceTypeName+"_"+json.data[i].username)
                for(j=0;j<riceType_timestamp.length;j++){
                  if(json.data[i].riceTypeName+"_"+json.data[i].username ==riceType_timestamp[j].target){
                    //console.log(json.data[i].riceTypeName+"_"+json.data[i].username)
                    riceType_timestamp[j].datapoints.push([1, new Date(json.data[i].myDate).getTime()])
                  }
                  
                }
              }
              
            }

            
                        
          } catch (error) {
              console.log("This is the part where it is error");
              console.error(error.message);
          };
      });      
  }).on("error", (error) => {
      console.error(error.message);
      
  });
  res.json(riceType_timestamp);
})







////////////////////////////////Filter content from /listInference 
var filterContent = []
app.get('/query', function(req, res) {
 
  //res.send("StartTime is set to " + req.query.startTime + ". EndTime is set to " + req.query.endTime + ". inspectStatus = "+ req.query.inspectStatus)

  var Status = req.query.Status
  let url = listInference;

  http.get(url,(res) => {
      let body = "";
  
      res.on("data", (chunk) => {
          body += chunk;
      });
      res.on("end", () => {
          try {    
              let json = JSON.parse(body); 
                       
              // do something with JSON by filtering riceInspectProcessing data
              console.log(req.query.revert)
              console.log(Status)
              if(req.query.revert==1){
                filterContent = []

                // Push all listInference and checking condition
                for (i = 0; i < json.data.length; i++) {
                  if(Status == "All"){
                    filterContent.push(json.data[i])    
                  }
                  if(Status == "Save"){
                    if(json.data[i].Status == Status){
                      filterContent.push(json.data[i])          
                    }     
                  }
                  if(Status == "Unsave"){
                    if(json.data[i].Status == Status){
                      filterContent.push(json.data[i])          
                    }     
                  }
                           
                }
              }

           
              filterUsernameTimestamp()
              
                          
          } catch (error) {
              console.log("This is the part where it is error");
              console.error(error.message);
          };
      });      
  }).on("error", (error) => {
      console.error(error.message);
      
  });
  
  //res.json(filterContent);
  res.json(username_timestamp)
})


usrArray = []
username_timestamp = []
var usrUnique_all;
var myObj;

function filterUsernameTimestamp(){
  usrArray = []  
              username_timestamp = []          
              

              //----------------------Find unique users----------------//
              for (i = 0; i < filterContent.length; i++) {              
                //colect all user including duplicate users
                if(filterContent[i].username != null){
                  usrArray.push(filterContent[i].username)
                }
              }
             
              
              
              //console.log(usrArray)
              // Add new set of non-duplicate users into usrUnique_all
              usrUnique_all = usrArray.unique();
              //usrUnique_all = func.findUniqueUser(usrArray)
              console.log(usrUnique_all);


              //----------------------Initiate mock up users structure--------//
              for(i=0;i<usrUnique_all.length; i++){

                myObj = {
                  "target": usrUnique_all[i],
                  "datapoints": [
                       
                  ]
                }
                username_timestamp.push(myObj);  
              }

              //Push time info into datapoints of targets
              for(i=0;i<filterContent.length;i++){
                for(j=0;j<username_timestamp.length;j++){

                  if(filterContent[i].username==username_timestamp[j].target){
                    username_timestamp[j].datapoints.push([1, new Date(filterContent[i].myDate).getTime()])
                  }
                  
                }
              }
}




app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

//module.exports = app;