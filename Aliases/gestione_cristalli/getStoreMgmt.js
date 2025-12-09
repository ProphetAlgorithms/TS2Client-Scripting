//Class: OtherMgmt
//Enabled: true
//ID: getStoreMgmt
//Propmt: false
//Script: true
//Pattern: "^(mput|mget)(?:\s+([0-9]+))?\s+((?:[a-zA-Z-]+))\s*(?:\s+([0-9]+))?$"
//Regex: true

let oggetto = match[3].split("-").filter(e => e !== "");
let personale = "ED" + TSPersonaggio;
let borsaPrincipale = "borsa-ombra";
let sendSilent = true;
let howManyCmd;
let howManyContainer;
let findResult;

if (typeof match[2] !== 'undefined') {
  howManyCmd = match[2]
} else {
  howManyCmd = 1;
}

if (typeof match[4] !== 'undefined') {
  howManyContainer = match[4] + "."
} else {
  howManyContainer = "";
}

if (typeof otherMgmtData == 'undefined' || _.isEmpty(otherMgmtData) === true) {
      this.otherMgmtData = {};
      otherMgmtData.sacca_alchimista = {
                                         "path": [],
                                         "obj": "sacca_alchimista",
                                         "default key": "sacca-ingredienti-alchemici-alchimisti",
                                         "key": "sacca-ingredienti-alchemici-alchimisti",
                                         "with_obj_key": false,
                                         "get_full_key": false,
                                         "get_one_key": true,
                                         "contenuto": {
                                                       "ferro": {
                                                                 "priority": false,
                                                                 "key": ["ferro"]
                                                                },
                                                       "zolfo": {
                                                                 "priority": false,
                                                                 "key": ["zolfo"]
                                                                },
                                                       "salnitro": {
                                                                 "priority": false,
                                                                 "key": ["salnitro"]
                                                                },
                                                       "mercurio": {
                                                                 "priority": false,
                                                                 "key": ["mercurio"]
                                                                },
                                                       "magnetite": {
                                                                 "priority": false,
                                                                 "key": ["magnetite"]
                                                                },
                                                       "seppia viva": {
                                                                 "priority": false,
                                                                 "key": ["seppia","viva"]
                                                                },
                                                       "tentacolo polpo": {
                                                                 "priority": false,
                                                                 "key": ["tentacolo","polpo"]
                                                                },
                                                       "cavalluccio marino": {
                                                                 "priority": false,
                                                                 "key": ["cavalluccio","marino"]
                                                                },
                                                       "scaglia drago": {
                                                                 "priority": false,
                                                                 "key": ["scaglia","drago"]
                                                                },
                                                       "gemma": {
                                                                 "priority": true,
                                                                 "key": ["gemma"]
                                                                }
                                                      }
                                       },
      otherMgmtData.teca = {
                             "path": [],
                             "obj": "teca",
                             "default key": "teca-rune",
                             "key": "teca-rune",
                             "with_obj_key": false,
                             "get_full_key": false,
                             "get_one_key": true,
                             "contenuto": {
                                           "runa": {
                                                    "priority": true,
                                                    "key": ["runa"]
                                                   }
                                          }
                          },
      otherMgmtData.scrigno_dorato = {
                                      "path": [],
                                      "obj": "scrigno_dorato",
                                      "default key": "scrigno-dorato",
                                      "key": "scrigno-dorato",
                                      "with_obj_key": true,
                                      "get_full_key": true,
                                      "get_one_key": false,
                                      "contenuto": {
                                                    "cristallo": {
                                                                  "priority": true,
                                                                  "key": ["cristallo"]
                                                                 },
                                                    "sangue drago goccia": {
                                                                  "priority": false,
                                                                  "key": ["sangue","drago","goccia"]
                                                                 }
                                                   }
                                     }
}

function resetData() {
      otherMgmtData = {};
      print(color("Dati del comando resettati.","#bb00bb"));
}

function findObj(objStrArr, containersObjList) {
  let toSearch = [];
  let ifStartWith = false;
  let input_without_priority = [];
  let put_index = "";
  let get_obj = objStrArr;
  let containerSend = "";
  //let regexParam = strArr.toString().replace(/,/g,"|");
  //let ifStartWithRegex = new RegExp("(?<=\\s|^)((?:" + regexParam + ")[^\\s]*)(?=\\s|$)","gm");
  for (const [container, containerStruct] of Object.entries(containersObjList)) {
    for (const [content, contentList] of Object.entries(containerStruct.contenuto)) {
       toSearch = [];
       if (contentList.priority === false) {
         toSearch = objStrArr;
       } else {
         input_without_priority = [...objStrArr];
         toSearch = contentList.key;     
       }
       for (let i in contentList.key) {
         for (let k in objStrArr) {
           ifStartWith = contentList.key[i].toLowerCase().startsWith(objStrArr[k].toLowerCase()); 
           if (ifStartWith) {
             if (input_without_priority.length > 1 && contentList.priority == true) {input_without_priority[k] = ""}
             toSearch = toSearch.toSpliced(0,1);
             if (toSearch.length == 0) {
               input_without_priority = input_without_priority.filter(str => str !== "");
               if (containerStruct.with_obj_key == true) {put_index = "2."}
               if (contentList.priority == true) {get_obj = input_without_priority}
               if (containerStruct.get_one_key == true) {get_obj = [get_obj[0]]}
               if (containerStruct.with_obj_key == true) {
                 containerSend = containerStruct.key + "-" + objStrArr.join("-")
               } else {
                 containerSend = containerStruct.key
               }
               return {
                       "result": true,
                       "put_index": put_index,
                       "get_obj": get_obj.join("-"),
                       "container": containerSend,
                       "path": containerStruct.path
                      }
             }
           }
         }
       }
    }
  }
  return {"result": false}
}

function getContainer(start, end, path) {
  let fullPath = [start, ...path, end];
  for (let i=1; i<fullPath.length; i++) {
       if (i == fullPath.length - 1) {
         send("~" + "get " + howManyContainer + fullPath[i] + " " + fullPath[i - 1], sendSilent);
       } else {
          send("~" + "get " + fullPath[i] + " " + fullPath[i - 1], sendSilent);
       }
  }
}

function storeContainer(start, end, path) {
  let fullPath = [start, ...path, end];
  for (let i=fullPath.length-1 ; i>0; i--) {
    send("~" + "metti " + fullPath[i] + " " + fullPath[i - 1], sendSilent);
  }
}

if (typeof otherMgmtData == 'undefined') {
  resetData();
}

switch (match[1]) {
  case "mput":
      findResult = findObj(oggetto, otherMgmtData);
      if (findResult.result) {
        getContainer(borsaPrincipale, findResult.container, findResult.path);
        for (let i = 0; i < howManyCmd; i++) {
            send("~" + "metti " + findResult.put_index + oggetto.join("-") + " " + findResult.container, sendSilent);
        } 
        storeContainer(borsaPrincipale, findResult.container, findResult.path);
      }
  break;
  case "mget":
      findResult = findObj(oggetto, otherMgmtData);
      if (findResult.result) {
        getContainer(borsaPrincipale, findResult.container, findResult.path);
        for (let i = 0; i < howManyCmd; i++) {
           send("~" + "get " + findResult.get_obj + " " + findResult.container, sendSilent);
        }
        storeContainer(borsaPrincipale, findResult.container, findResult.path);
      }   
}

switch (oggetto[0]) {
  case "reset":
    resetData();
}
