
var formNameCount_public;
var usernameCount_public;
var publicVar;
module.exports = {
    removeDuplicates: function (array) {
        return array.filter((a, b) => array.indexOf(a) === b)
    },
    uniqueCount: function (array){
        var count = {};
        array.forEach(function(i) { count[i] = (count[i]||0) + 1;});
        //console.log(count);
        this.test(count);
    },
    test: function(struct){
        var userCnt = []
        Object.keys(struct).forEach(key => {

            myObj = {
                "target": key,
                "datapoints": [
                    [struct[key], 1600789756000]
                ]
            }
            userCnt.push(myObj);
            publicVar = userCnt;
        })
        
    },
    returnIndex: function(){
      return publicVar;
    },
    returnIndex_formNameCount: function(){
        return formNameCount_public
    },
    returnIndex_usernameCount: function(){
        return usernameCount_public
    },
    findUniqueUser: function(inputArray){
      var uniqueUser = []
      let findDuplicates = arr => arr.filter((item, index) => arr.indexOf(item) != index)
      uniqueUser = ([...new Set(findDuplicates(inputArray))])
      return uniqueUser

    },
    countFormNameTh: function(inputlist){
      //////Add on
      var formNameCount = []
      ///////
      array_elements = inputlist
      array_elements.sort();
      
      var current = null;
      var cnt = 0;
      for (var i = 0; i < array_elements.length; i++) {
        if (array_elements[i] != current) {
          if (cnt > 0) {
              console.log(current + ' comes --> ' + cnt + ' times');

              // Add on ///////
              myObj = {
                "target": current+"_formname_count",
                "datapoints": [
                  [ cnt , 1620970587000 ]    
                ]
              }
              formNameCount.push(myObj);  
              ///////////////////
            }
          current = array_elements[i];
          cnt = 1;
        } else {
          cnt++;
        }
      }
      if (cnt > 0) {
        console.log(current + ' comes --> ' + cnt + ' times');
        /////Add on /////
        myObj = {
          "target": current+"_formname_count",
          "datapoints": [
            [cnt, 1620970587000]
          ]
        }
        formNameCount.push(myObj);
        //////////////////////////
      }
      formNameCount_public = formNameCount
    },
    countUsername: function(inputlist){
      //////Add on
      var usernameCount = []
      ///////
      array_elements = inputlist
      array_elements.sort();
      
      var current = null;
      var cnt = 0;
      for (var i = 0; i < array_elements.length; i++) {
        if (array_elements[i] != current) {
          if (cnt > 0) {
              console.log(current + ' comes --> ' + cnt + ' times');

              // Add on ///////
              myObj = {
                "target": current+"_username_count",
                "datapoints": [
                  [ cnt , 1620970587000 ]    
                ]
              }
              usernameCount.push(myObj);  
              ///////////////////
            }
          current = array_elements[i];
          cnt = 1;
        } else {
          cnt++;
        }
      }
      if (cnt > 0) {
        console.log(current + ' comes --> ' + cnt + ' times');
        /////Add on /////
        myObj = {
          "target": current+"_username_count",
          "datapoints": [
            [cnt, 1620970587000]
          ]
        }
        usernameCount.push(myObj);
        //////////////////////////
      }
      usernameCount_public = usernameCount
    }
  };


