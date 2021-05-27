const express = require('express')
const app = express()
var port = process.env.PORT || 3339;
var func = require('./function')
var path = require('path');
const https = require('https');
const http = require('http');
const { timeStamp } = require('console');
const e = require('express');

//URL that data has been taken from dynamodb
var riceInspectProcessingUrl = "https://4skomnp9df.execute-api.ap-southeast-1.amazonaws.com/default/Gafrana_get_data_RiceInferenceProcessing"
var listInference = "http://13.212.86.129:3000/listInference"

//get inference for further processes
var getlistinference_URL = "https://i8svvrd7uc.execute-api.ap-southeast-1.amazonaws.com/production/get_listinference"
var getALL_filtercontent_URL = "https://i8svvrd7uc.execute-api.ap-southeast-1.amazonaws.com/production/grafana/filtercontent"

//all query and filtering data
var query_table_riceinspectprocessing_URL = "https://i8svvrd7uc.execute-api.ap-southeast-1.amazonaws.com/production/query_table_riceinspectprocessing"
var query_data_riceinspectprocessing_URL = "https://i8svvrd7uc.execute-api.ap-southeast-1.amazonaws.com/production/query/?startTime=2021-05-14%2009:43:04&endTime=2021-05-20%2012:42:17&inspectStatus=A&revert=1"
var filter_UsernameTimestamp_URL = "https://i8svvrd7uc.execute-api.ap-southeast-1.amazonaws.com/production/api/get_data_riceinspectprocessing_usernametimestamp"


  



app.get('/get_table_riceinspectprocessing', function(req, res) {
  res.json(table_riceInspectProcessing);
});


// get table from riceinspectprocessing

var table_riceInspectProcessing =
  {
    columns: [{text: 'myDate', type: 'time'}, {text: 'serverID', type: 'number'}, {text: 'username', type: 'string'}, 
    {text: 'formNameTH', type: 'string'}, {text: 'inspectStatus', type: 'string'}, {text: 'riceTypeTH', type: 'string'}],
    rows: [
      [ 1234567, 'SE', 123 ],
      [ 1234567, 'DE', 231 ],
      [ 1234567, 'US', 321 ],
    ]
  };




app.get('/query_table_riceinspectprocessing', function(req, res) {

  let url = riceInspectProcessingUrl;

  https.get(url,(res) => {
      let body = "";
  
      res.on("data", (chunk) => {
          body += chunk;
      });
      res.on("end", () => {
          try {    
              let json = JSON.parse(body); 
              table_riceInspectProcessing.rows = []   
              // do something with JSON by filtering riceInspectProcessing data
              for (i = 0; i < json.content.length; i++) {

                table_riceInspectProcessing.rows.push([
                  new Date(json.content[i].myDate).getTime(), 
                  json.content[i].serverID,
                  json.content[i].username,
                  json.content[i].formNameTH,
                  json.content[i].inspectStatus,
                  json.content[i].riceTypeTH
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




var array_listInference = []
app.get('/get_listinference', function(req, res) {

  let url = listInference;

  http.get(url,(res) => {
      let body = "";
  
      res.on("data", (chunk) => {
          body += chunk;
      });
      res.on("end", () => {
          try {    
              let json = JSON.parse(body); 
              array_listInference = []    
              // do something with JSON by filtering riceInspectProcessing data
              for (i = 0; i < json.data.length; i++) {
                var obj = { 
                  username_listInference: json.data[i].username+"_listInference",
                  processedDate_listInference: json.data[i].processedDate,
                  imageURL: json.data[i].imageURL }; 

                array_listInference.push(obj)  
                             
              }
                           
          } catch (error) {
              console.log("This is the part where it is error");
              console.error(error.message);
          };
      });      
  }).on("error", (error) => {
      console.error(error.message);
      
  });
  res.json(array_listInference);
})







////////////////////////////////Filter content from /listInference and /riceInspectProcessing
var filterContent = []
app.get('/query', function(req, res) {
 
  //res.send("StartTime is set to " + req.query.startTime + ". EndTime is set to " + req.query.endTime + ". inspectStatus = "+ req.query.inspectStatus)
  var startTime = new Date(req.query.startTime).getTime() 
  var endTime = new Date(req.query.endTime).getTime() 
  var inspectStatus = req.query.inspectStatus
  let url = riceInspectProcessingUrl;

  https.get(url,(res) => {
      let body = "";
  
      res.on("data", (chunk) => {
          body += chunk;
      });
      res.on("end", () => {
          try {    
              let json = JSON.parse(body); 
                       
              // do something with JSON by filtering riceInspectProcessing data
              console.log(req.query.revert)
              if(req.query.revert==1){
                filterContent = []
                // Push all riceInspectProcessing
                for (i = 0; i < json.content.length; i++) {
                  if(json.content[i].inspectStatus == inspectStatus){
                    filterContent.push(json.content[i])          
                  }              
                }
                // Push all listInference 
                for(i=0;i<array_listInference.length;i++){
                    filterContent.push(array_listInference[i])
                    
                }

              }
              if(req.query.revert==0){
                filterContent = []
                for (i = 0; i < json.content.length; i++) {              
                  if(json.content[i].myDate >= req.query.startTime && json.content[i].myDate <= req.query.endTime && json.content[i].inspectStatus == inspectStatus){
                    filterContent.push(json.content[i])
                  } 
                  if(array_listInference[i].processedDate_listInference >= req.query.startTime && array_listInference[i].processedDate_listInference <= req.query.endTime){
                    filterContent.push(array_listInference[i])
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
  res.json(filterContent);
})


usrArray = []
username_timestamp = []
var usrUnique_all;
var myObj;

app.get('/api/get_data_riceinspectprocessing_usernametimestamp', function(req, res){
  //setCORSHeaders(res);
  //let url = riceInspectProcessingUrl;
  //choose /filtercontent if you want to filterdata from this path first
  //let url = "http://localhost:3339/grafana/filtercontent"

              usrArray = []  
              username_timestamp = []          
              

              //----------------------Find unique users----------------//
              for (i = 0; i < filterContent.length; i++) {              
                //colect all user including duplicate users
                if(filterContent[i].username != null){
                  usrArray.push(filterContent[i].username)
                }
              }
              for (i = 0; i < filterContent.length; i++) {              
                //colect all formNameTH including duplicate users
                if(filterContent[i].formNameTH != null){
                  usrArray.push(filterContent[i].formNameTH)
                }
              }
              for (i = 0; i < filterContent.length; i++) {              
                //colect all username_listInference including duplicate users
                if(filterContent[i].username_listInference != null){
                  usrArray.push(filterContent[i].username_listInference)
                }
              }
              
              console.log(usrArray)
              // Add new set of non-duplicate users into usrUnique_all
              usrUnique_all = func.findUniqueUser(usrArray)
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

              for(i=0;i<filterContent.length;i++){
                for(j=0;j<username_timestamp.length;j++){

                  if(filterContent[i].username==username_timestamp[j].target){
                    username_timestamp[j].datapoints.push([1, new Date(filterContent[i].myDate).getTime()])
                  }
                  if(filterContent[i].formNameTH==username_timestamp[j].target){
                    username_timestamp[j].datapoints.push([1, new Date(filterContent[i].myDate).getTime()])
                  }
                  
                  if(filterContent[i].username_listInference==username_timestamp[j].target){
                    username_timestamp[j].datapoints.push([1, new Date(filterContent[i].processedDate_listInference).getTime()])
                  }
                }
              }
              
                    

  res.json(username_timestamp);
  
});




app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

//module.exports = app;