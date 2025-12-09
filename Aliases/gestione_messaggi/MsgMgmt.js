//Class: StrMsg
//Enabled: true
//ID: MsgMgmt
//Propmt: false
//Script: true
//Pattern: "msgmgmt"
//Regex: false

//Divido i parametri in un array
let arrParams = $1.trim().split(/\s+/);
//Se non ci sono parametri, split restituisce una stringa vuota e in questo caso setto params come
//vettore vuoto per poterne controllare la lunghezza
let cmd = arrParams[0];
if (arrParams == "") {arrParams = [];}

//Funzione che traduce i colori usati da questo alias in quelli usati nella funzione 'color'
function cmdToCliColor (str, ...args) {
     if (typeof str == "string" && args.length <= 3) {
       let colArgs = ["#c0c0c0","#000", false, false, false];
       let effects = [];
       for (const arg of args) {
         switch (true) {
            case MsgData.colorMgmt["cmdColor"].includes(String(arg).toLowerCase()):
              colArgs[0] = MsgData.colorMgmt["cliColor"][MsgData.colorMgmt["cmdColor"].indexOf(String(arg).toLowerCase())];
              break;
            case MsgData.colorMgmt["cmdBgr"].includes(String(arg).toLowerCase()):
              colArgs[1] = MsgData.colorMgmt["cliBgr"][MsgData.colorMgmt["cmdBgr"].indexOf(String(arg).toLowerCase())];
              break;
            case MsgData.colorMgmt["cliEffects"].includes(String(arg).toLowerCase()):
              effects.push(String(arg).toLowerCase());
              break;
            default:
              return {"error": menuColor("Valore " + "\"" + menuDataColor(arg) + "\" non trovato.\r\r")}
         }
       }
       if (effects.length > 0) {
         switch (effects[0]) {
            case "high":
              colArgs[0] = MsgData.colorMgmt["cliHighColor"][MsgData.colorMgmt["cliColor"].indexOf(colArgs[0])];
              break;
            case "under":
              colArgs[3] = true;
              break;
            case "blink":
              colArgs[4] = true;
              break;
            case "reverse":
              [colArgs[0], colArgs[1]] = [colArgs[1], colArgs[0]];
              break;
         }
     }
     return color(str,...colArgs);
   } else {
     return {"error": menuColor("Il primo parametro non è una stringa o ci sono più di 4 parametri.")};
   }
}

//Funzione per tradurre un colore nel formato usato da questo alias nel codice colore del mud
function cmdToMudColor(...args) {
   if (args.length > 0 && args.length <= 3) {
     let colArgs = ["0","0", "07"];
     for (const arg of args) {
       switch (true) {
          case MsgData.colorMgmt["cmdColor"].includes(String(arg).toLowerCase()):
            colArgs[2] = MsgData.colorMgmt["mudColor"][MsgData.colorMgmt["cmdColor"].indexOf(String(arg).toLowerCase())];
            break;
          case MsgData.colorMgmt["cmdBgr"].includes(String(arg).toLowerCase()):
            colArgs[1] = MsgData.colorMgmt["mudBgr"][MsgData.colorMgmt["cmdBgr"].indexOf(String(arg).toLowerCase())];
            break;
          case MsgData.colorMgmt["cliEffects"].includes(String(arg).toLowerCase()):
            colArgs[0] = MsgData.colorMgmt["mudEffects"][MsgData.colorMgmt["cliEffects"].indexOf(String(arg).toLowerCase())];
            break;
          default:
            return {"error": menuColor("Valore " + "\"" + menuDataColor(arg) + "\" non trovato.\r\r")}
       }
     }
     return colArgs.join("");
   } else {
     return {"error": menuColor("Numero dei parametri errato: ") + menuDataColor(String(args.length)) + "\r"};
   }
}

//Funzione per tradurre un colore dal codice colore del mud al formato usato da questo alias
function mudToCmdColor(arg) {
   if (arguments.length == 1 && /^\d\d\d\d$/gm.test(arg)) {
     let arrMudColor = [...arg.matchAll(/(\d)(\d)(\d\d)/gm)];
     let cliArgs = [];
     if (MsgData.colorMgmt["mudColor"].includes(String(arrMudColor[0][3]))) {
       cliArgs.push(MsgData.colorMgmt["cmdColor"][MsgData.colorMgmt["mudColor"].indexOf(String(arrMudColor[0][3]))]);
     } else {
       return  {"error": menuColor("Colore del testo non trovato.\r\r")};
     }
     if (MsgData.colorMgmt["mudBgr"].includes(String(arrMudColor[0][2]))) {
       cliArgs.push(MsgData.colorMgmt["cmdBgr"][MsgData.colorMgmt["mudBgr"].indexOf(String(arrMudColor[0][2]))]);
     } else {
       return  {"error": menuColor("Colore dello sfondo non trovato.\r\r")};
     }
     if (MsgData.colorMgmt["mudEffects"].includes(String(arrMudColor[0][1]))) {
       cliArgs.push(MsgData.colorMgmt["cliEffects"][MsgData.colorMgmt["mudEffects"].indexOf(String(arrMudColor[0][1]))]);
     } else {
       return  {"error": menuColor("Effetto non trovato.\r\r")};
     }
     return cliArgs;
   } else {
     return  {"error": menuColor("Nessun parametro o errato.\r\r")};
   }
}

//Funzione usata per controllare se un codice colore, che sia in formato del mud o dell'alias, esista
function colorCheck(...args) {
   //Controllo se ci sono da 1 a 3 parametri
   if (args.length > 0 && args.length <= 3) {
     if (arguments.length == 1 && /^\d\d\d\d$/gm.test(args[0])) {
       let arrMudColor = [...args[0].matchAll(/(\d)(\d)(\d\d)/gm)];
       if (!MsgData.colorMgmt["mudColor"].includes(String(arrMudColor[0][3]))) {
         return  {"error": menuColor("Colore del testo non trovato.\r\r")};
       }
       if (!MsgData.colorMgmt["mudBgr"].includes(String(arrMudColor[0][2]))) {
         return  {"error": menuColor("Colore dello sfondo non trovato.\r\r")};
       }
       if (!MsgData.colorMgmt["mudEffects"].includes(String(arrMudColor[0][1]))) {
         return  {"error": menuColor("Effetto non trovato.\r\r")};
       }
       return [arrMudColor[0][1],arrMudColor[0][2],arrMudColor[0][3]].join("");
     } else {
       //C'è più di un parametro o un solo parametro e non è un codice del mud
       return cmdToMudColor(...args);
     }
   } else {
     //Numero parametri errato
     return {"error": menuColor("Numero dei parametri errato: ") + menuDataColor(String(args.length)) + "\r"}; 
   }
}

//Wrapper della funzione 'color' che assegna il 'menuColor' ad una data stringa
function menuColor(str) {
   return cmdToCliColor(str, MsgData.menuMgmt["menuColor"])
}

//Wrapper della funzione 'color' che assegna il 'borderColor' ad una data stringa
function menuBorderColor(str) {
   return cmdToCliColor(str, MsgData.menuMgmt["borderColor"])
}

//Wrapper della funzione 'color' che assegna il 'dataColor' ad una data stringa
function menuDataColor(str) {
   return cmdToCliColor(str, MsgData.menuMgmt["dataColor"])
}

//Wrapper della funzione 'color' che assegna il 'infoColor' ad una data stringa
function menuInfoColor(str) {
   return cmdToCliColor(str, MsgData.menuMgmt["infoColor"])
}

//Funzione usata per avere un'anteprima del colore e può restituire due risultati diversi in base al primo parametro
//nel caso di una stringa nulla o meno: 
//- se il primo parametro non è una stringa vuota il risultato sarà la stessa stringa colorata del colore assegnato al
//  secondo parametro;
//- se il primo parametro è una stringa vuota il risultato sarà il nome del colore del testo colorato con lo stesso 
//  colore che rappresenta affiancato dallo stesso colore sotto forma del codice mud e dal nome dello sfondo e 
//  dell'effetto, nel formato dell'alias, tra parentesi.
//  Es: grigio-chiaro - 0007 (bg-nero,nofx)
function colorPreview(str, ...args) {
   if (str == "") {
     //Se il primo parametro è una stringa vuota
     let err = {};
     switch (true) {
        case /^\d\d\d\d$/gm.test(args[0]): 
          if ((err = mudToCmdColor(args[0])).error === undefined) {
            let cliCol = mudToCmdColor(args[0]);
            return cmdToCliColor(cliCol[0], ...cliCol) + menuDataColor(" - " + args[0] + " (" + cliCol[1] + "," + cliCol[2] + ")");
          } else {
            return err;
          }
        case (err = cmdToMudColor(...args)).error === undefined:
          let mudCol = cmdToMudColor(...args);
          let cmdCol = mudToCmdColor(mudCol);
          return cmdToCliColor(cmdCol[0], ...cmdCol) + menuDataColor(" - " + mudCol + " (" + cmdCol[1] + "," + cmdCol[2] + ")");
        default:
          return err; 
     }
   } else {
     //Se il primo parametro non è una stringa vuota
     let err = {};
     switch (true) {
        case /^\d\d\d\d$/gm.test(args[0]): 
          if ((err = mudToCmdColor(args[0])).error === undefined) {
            let cliCol = mudToCmdColor(args[0]);
            return cmdToCliColor(str, ...cliCol);
          } else {
            return err;
          }
        case (err = cmdToMudColor(...args)).error === undefined:
          return cmdToCliColor(str, ...args);
        default:
          return err; 
     }
   }
}

//Funzione che rappresenta una stringa colorata nel formato nel mud nel formato del client, usando la funzione 'print'
function stringPreview(sStr, eStr) {
   if (arguments.length == 2) {
     let preview = "";
     let str1 = "";
     let str2 = "";
     let arrsStr = [...sStr.matchAll(/(\$c(\d\d\d\d))?(.*?)(?=\$c\d\d\d\d|$)/gm)];
     let arreStr = [...eStr.matchAll(/(\$c(\d\d\d\d))?(.*?)(?=\$c\d\d\d\d|$)/gm)];
     for (const str of arrsStr) {
        if (str[3] != "" && str[3] !== undefined && str[3] !== "nostring") {
          let col = str[2] != "" && str[2] !== undefined ? str[2] : "0007"
          str1 = str1 + cmdToCliColor(tagToCode(String(str[3])),...mudToCmdColor(col));
        }
     }
     if (str1 != "") {str1 = str1 + " "}
     preview = str1 + menuDataColor("'messaggio'");
     for (const str of arreStr) {
        if (str[3] != "" && str[3] !== undefined && str[3] !== "nostring") {
          let col = str[2] != "" && str[2] !== undefined ? str[2] : "0007"
          str2 = str2 + cmdToCliColor(tagToCode(String(str[3])),...mudToCmdColor(col));
        }
     }
     if (str2 != "") {str2 = " " + str2}
     preview = preview + str2;
      return preview;
   } else {
     return {"error": menuColor("numero parametri diversi da 2.\r\r")};
   }
}

//Funzione usata per creare un'anteprima dei primi n colori di una lista di colori, usando la funzione colorPreview
function listsPreview(codeList){
  let namePreview = ["Primo","Secondo","Terzo","Quarto"];
  let preview = [];
  let len = namePreview.length;
  for (let i = 0; i < len; i++) {
    if (codeList[i] !== undefined) {
      preview.push(colorPreview(namePreview[i],codeList[i]))
    }
  }
  if (len < codeList.length) {preview.push(menuDataColor("..."))}
  return preview.join(menuDataColor(" "));
}

//Funzione usata per controllare se una stringa ha solo codici colore
function onlyColor(str) {
   if (arguments.length == 1) {
     let arrStr = [...str.matchAll(/(\$c(\d\d\d\d))?(.*?)(?=\$c\d\d\d\d|$)/gm)];
     for (const mStr of arrStr) {
       if (mStr[3] != "" && mStr[3] !== undefined) {
         return str;
       }
     }
     print(menuColor("La stringa '") + menuDataColor(str) + menuColor("' ha solo codice colore, verrà sostituita con '") + menuDataColor("nostring") + menuColor("'.\r"))
     return "nostring";
   } else {
     return {"error": "è necessario un solo parametro.\r"};
   }
}

//Funzione usata per l'anteprima delle informazioni della modalità di default, se è selezionato il valore 0
// mostrerà il colore base altrimenti il colore dell'indice > 0
function defZeroPreview(cmd) {
   let activeDef = MsgData[cmd]["activeDefMudColor"];
   if (activeDef > 0 && MsgData[cmd]["listDefMudColor"].length >= activeDef) {
     return colorPreview("",MsgData[cmd]["listDefMudColor"][activeDef - 1]);
   } else {
     return colorPreview("",MsgData.colorMgmt.cmdDefault[cmd][0]);
   }
}

//Funzione usata per l'anteprima delle informazioni delle stringhe, se è selezionato il valore 0
// mostrerà la stringa 'nessuna' altrimenti la stringa rappresentata dall'indice > 0
function stringZeroPreview(cmd) {
   let activeString = MsgData[cmd]["activeString"];
   if (activeString > 0 && MsgData[cmd]["startString"].length >= activeString && MsgData[cmd]["endString"].length >= activeString) {
     return stringPreview(MsgData[cmd]["startString"][activeString - 1],MsgData[cmd]["endString"][activeString - 1]);
   } else {
     return menuDataColor("nessuna");
   }
}

//Funzione che calcola la lunghezza di una stringa anche se manipolata dalla funzione 'color'
function strLen(str) {
   let stripStr = "";
   let arrStr = [...str.matchAll(/<span.*?>(?:(.+?)(?:<\/span>))?/gm)];
   for (const m of arrStr) {
     if (m[1] !== undefined && m[1] != "") {
       stripStr = stripStr + m[1];
     }
   }
   if (stripStr.length != 0) {return stripStr.length} else {return "0"}
}

//Funzione per sostituire il carattere '<' con l'entità html che lo rappresenta
function tagToCode(str) {
   return str.replace(/</gm, "\&lt;");  
}

//Funzione usata per generare l'anteprima dell'indice di una lista formattandolo in base alla lunghezza della lista
function indexPreview(index, maxIndex) {
   let offset = String(maxIndex).length - String(index + 1).length;
   return menuDataColor(" ".repeat(offset) + (index + 1) + ") ")
}

//Funzione usata per generare l'anteprima della lista usata dalla modalità 'def' affiancata alla lista delle stringhe
function defaultsAndStringsPreview(cmd) {
   let empty = 0;
   let col1 = menuColor("Lista dei colori di default (") + menuDataColor("" + MsgData[cmd]["listDefMudColor"].length) + menuColor("):");
   let col2 = menuColor("Lista delle stringhe (") + menuDataColor("" + MsgData[cmd]["startString"].length) + menuColor("):");
   print(col1 + " ".repeat(70 - strLen(col1)) + col2);
   let dLen = MsgData[cmd]["listDefMudColor"].length;
   let sLen = MsgData[cmd]["startString"].length;
   let len = dLen >= sLen ? dLen : sLen;
   len = (len == 0 ? 1 : len);
   for (let i = 0; i < len; i++) {
      if (MsgData[cmd]["listDefMudColor"][i] !== undefined) {
        col1 = indexPreview(i,dLen) + colorPreview("",MsgData[cmd]["listDefMudColor"][i]);
      }  else if (MsgData[cmd]["listDefMudColor"][i] === undefined && i == 0) {
         col1 = menuDataColor( " ".repeat(10) + "lista vuota");
      } else {
        col1 = "";
      }
       if (MsgData[cmd]["startString"][i] !== undefined) {
        col2 = indexPreview(i,sLen) + stringPreview(MsgData[cmd]["startString"][i],MsgData[cmd]["endString"][i]);
      }  else if (MsgData[cmd]["startString"][i] === undefined && i == 0) {
         col2 = menuDataColor( " ".repeat(3) + "lista vuota");
      } else {
        col2 = "";
      }
      print(col1 + " ".repeat(70 - strLen(col1)) + col2);
   }      
}

//Funzione usata per generare l'anteprima della lista usata dalla modalità 'seq' e 'rand' affiancata alla lista delle liste salvate
function randseqAndListsPreview(cmd) {
   let col1 = menuColor("Lista dei colori per la modalità 'seq' e 'rand' (") + menuDataColor("" + MsgData[cmd]["listMudColor"].length) + menuColor("):");
   let col2 = menuColor("Liste salvate (") + menuDataColor("" + MsgData[cmd]["listsMudColor"].length) + menuColor("):");
   print(col1 + " ".repeat(70 - strLen(col1)) + col2);
   let dLen = MsgData[cmd]["listMudColor"].length;
   let sLen = MsgData[cmd]["listsMudColor"].length;
   let len = dLen >= sLen ? dLen : sLen;
   len = (len == 0 ? 1 : len);
   for (let i = 0; i < len; i++) {
      if (MsgData[cmd]["listMudColor"][i] !== undefined) {
        col1 = indexPreview(i,dLen) + colorPreview("",MsgData[cmd]["listMudColor"][i]);
      }  else if (MsgData[cmd]["listMudColor"][i] === undefined && i == 0) {
         col1 = menuDataColor( " ".repeat(10) + "lista vuota");
      } else {
        col1 = "";
      }
       if (MsgData[cmd]["listsMudColor"][i] !== undefined) {
        col2 = indexPreview(i,sLen) + listsPreview(MsgData[cmd]["listsMudColor"][i]);
      }  else if (MsgData[cmd]["listsMudColor"][i] === undefined && i == 0) {
         col2 = menuDataColor( " ".repeat(3) + "lista vuota");
      } else {
        col2 = "";
      }
      print(col1 + " ".repeat(70 - strLen(col1)) + col2);
   }      
}

//Funzione usata per l'anteprima dettagliata di una sezione del codice colore del mud, accetta anche un indice per
//scegliere quale colore, della lista disponibile, analizzare
function colorHelpPreview(section,index) {
   let col = ["0","0","00"];
   if (arguments.length == 2 && (section == "c" || section == "s" || section == "e")) {
     switch (section) {
        case "c":
          if (MsgData.colorMgmt["mudColor"][index] !== undefined) {
            col[1] = MsgData.colorMgmt["mudColor"][index] == "00" ? "7" : col[1];
            col[2] = MsgData.colorMgmt["mudColor"][index];
            return cmdToCliColor(mudToCmdColor(col.join(""))[0],...mudToCmdColor(col.join(""))) + menuDataColor(" - " + col[2]);
          } else {
            return "";
          }
          break;
        case "s":
          if (MsgData.colorMgmt["mudBgr"][index] !== undefined) {
            col[2] = MsgData.colorMgmt["mudBgr"][index] == "0" ? "07" : col[2];
            col[1] = MsgData.colorMgmt["mudBgr"][index];
            return cmdToCliColor(mudToCmdColor(col.join(""))[1],...mudToCmdColor(col.join(""))) + menuDataColor(" - " + col[1]);
          } else {
            return "";
          }
            break;
        case "e":
          if (MsgData.colorMgmt["mudEffects"][index] !== undefined) {
            col[2] = "02";
            col[0] = MsgData.colorMgmt["mudEffects"][index];
            return cmdToCliColor(mudToCmdColor(col.join(""))[2],...mudToCmdColor(col.join(""))) + menuDataColor(" - " + col[0]);
          } else {
            return "";
          }
          break;
     }         
   } else {
     //error
     return {"error": menuColor("Parametri errati"), "func": "colorHelpPreview(section,index)"}
   }
}     

//Funzione usata per controllare se una coppia di stringhe, di inizio e fine messaggio, siano già presenti
function stringCheck(cmd, sStr, eStr, sStrLst, eStrLst) {
  let sCol = "";
  let eCol = "";
  if (!(/^\$c\d\d\d\d/gm.test(String(sStr))) && sStr != "nostring") {sCol = "$c" + MsgData[cmd]["defColor"]}
  if (!(/^\$c\d\d\d\d/gm.test(String(eStr))) && eStr != "nostring") {eCol = "$c" + MsgData[cmd]["defColor"]}
  let len = sStrLst.length;
  let str = sCol + sStr + eCol + eStr;
  for (let i = 0; i < len; i++) {
    if (str == (sStrLst[i] + eStrLst[i])) {return {"ok": "Stringa trovata."}}
  }
  return {"error": "Stringa non trovata."};
}

//Funzione che genera l'help del comando 'default'
function defaultHelp(cmd, param) {
   print(menuBorderColor("__________________________________________________________________________________________________________\r\r"));
   print(menuColor("Questo comando serve ad aggiungere, eliminare, cambiare, selezionare un colore dalla lista dei colori di"));
   print(menuColor("default o resettare l'intera lista. Puoi aggiungere il codice numerico di 4 cifre o il nome del colore,"));
   print(menuColor("dello sfondo e degli effetti.") + "\n");
   print(menuColor("Per aggiungere un colore:"));
   print(menuColor("'") + menuDataColor(cmd + " " + param + " + 1006") + menuColor("'"));
   print(menuColor("'") + menuDataColor(cmd + " " + param + " + verde-scuro") + menuColor("'"));
   print(menuColor("'") + menuDataColor(cmd + " " + param + " + bg-marrone verde-scuro") + menuColor("'"));
   print(menuColor("'") + menuDataColor(cmd + " " + param + " + blink verde-scuro bg-rosso") + menuColor("'") + "\n");
   print(menuColor("Per eliminare un colore:"));
   print(menuColor("'") + menuDataColor(cmd + " " + param + " - 1") + menuColor("'"));
   print(menuColor("'") + menuDataColor(cmd + " " + param + " - 4") + menuColor("'") + "\n");
   print(menuColor("Per sostituire un colore:"));
   print(menuColor("'") + menuDataColor(cmd + " " + param + " 12 1006") + menuColor("'"));
   print(menuColor("'") + menuDataColor(cmd + " " + param + " 1 giallo") + menuColor("'"));
   print(menuColor("'") + menuDataColor(cmd + " " + param + " 3 bg-marrone verde-scuro") + menuColor("'"));
   print(menuColor("'") + menuDataColor(cmd + " " + param + " 7 blink verde-scuro bg-rosso") + menuColor("'") + "\n");
   print(menuColor("Per selezionare un colore (0 è il colore base del canale):"));
   print(menuColor("'") + menuDataColor(cmd + " " + param + " set 1") + menuColor("'"));
   print(menuColor("'") + menuDataColor(cmd + " " + param + " set 0") + menuColor("'") + "\n");
   print(menuColor("Per resettare la lista:"));
   print(menuColor("'") + menuDataColor(cmd + " " + param + " reset") + menuColor("'") + "\n");
   codeColorHelpPreview();
   print(menuBorderColor("__________________________________________________________________________________________________________\r\r"));
}

//Funzione che genera l'help del comando 'color'
function colorHelp(cmd, param) {
   print(menuBorderColor("__________________________________________________________________________________________________________\r\r"));
   print(menuColor("Questo comando serve ad aggiungere, eliminare, cambiare un colore dalla lista dei colori usati in modo"));
   print(menuColor("casuale o resettare l'intera lista. Puoi aggiungere il codice numerico di 4 cifre o il nome del colore,"));
   print(menuColor("dello sfondo e degli effetti.") + "\n");
   print(menuColor("Per aggiungere un colore:"));
   print(menuColor("'") + menuDataColor(cmd + " " + param + " + 1006") + menuColor("'"));
   print(menuColor("'") + menuDataColor(cmd + " " + param + " + verde-scuro") + menuColor("'"));
   print(menuColor("'") + menuDataColor(cmd + " " + param + " + bg-marrone verde-scuro") + menuColor("'"));
   print(menuColor("'") + menuDataColor(cmd + " " + param + " + blink verde-scuro bg-rosso") + menuColor("'") + "\n");
   print(menuColor("Per eliminare un colore:"));
   print(menuColor("'") + menuDataColor(cmd + " " + param + " - 1") + menuColor("'"));
   print(menuColor("'") + menuDataColor(cmd + " " + param + " - 4") + menuColor("'") + "\n");
   print(menuColor("Per sostituire un colore:"));
   print(menuColor("'") + menuDataColor(cmd + " " + param + " 12 1006") + menuColor("'"));
   print(menuColor("'") + menuDataColor(cmd + " " + param + " 1 giallo") + menuColor("'"));
   print(menuColor("'") + menuDataColor(cmd + " " + param + " 3 bg-marrone verde-scuro") + menuColor("'"));
   print(menuColor("'") + menuDataColor(cmd + " " + param + " 7 blink verde-scuro bg-rosso") + menuColor("'") + "\n");
   print(menuColor("Per resettare la lista:"));
   print(menuColor("'") + menuDataColor(cmd + " " + param + " reset") + menuColor("'") + "\n");
   codeColorHelpPreview();
   print(menuBorderColor("__________________________________________________________________________________________________________\r\r"));
}

//Funzione che genera l'help del comando 'string'
function stringHelp(cmd, param) {
   print(menuBorderColor("__________________________________________________________________________________________________________\r\r"));
   print(menuColor("Questo comando serve a salvare,elminare,selezionare una stringa o eliminare tutte le stringhe salvate.") + "\n");
   print(menuColor("Per aggiungere una stringa:"));
   print(menuColor("* Se si desidera una stringa vuota inserire la parola '") + menuDataColor("nostring") + menuColor("'."));
   print(menuColor("* Se una stringa contiene solo codici colore verà sostituita con '") + menuDataColor("nostring") + menuColor("'."));
   print(menuColor("'") + menuDataColor(cmd + " " + param + " + &lt;start string&gt; &lt;end string&gt;") + menuColor("'") + "\n");
   print(menuColor("Per eliminare una tringa:"));
   print(menuColor("'") + menuDataColor(cmd + " " + param + " - 1") + menuColor("'"));
   print(menuColor("'") + menuDataColor(cmd + " " + param + " - 4") + menuColor("'") + "\n");
   print(menuColor("Per sostituire una stringa:"));
   print(menuColor("'") + menuDataColor(cmd + " " + param + " 12 &lt;start string&gt; &lt;end string&gt;") + menuColor("'") + "\n");
   print(menuColor("Per selezionare una stringa (0 è nessuna stringa):"));
   print(menuColor("'") + menuDataColor(cmd + " " + param + " set 1") + menuColor("'"));
   print(menuColor("'") + menuDataColor(cmd + " " + param + " set 3") + menuColor("'") + "\n");
   print(menuColor("Per resettare la lista delle stringhe:"));
   print(menuColor("'") + menuDataColor(cmd + " " + param + " reset") + menuColor("'"));
   print(menuBorderColor("__________________________________________________________________________________________________________\r\r"));
}


//Funzione che genera l'help del comando 'list'
function listHelp(cmd, param) {
   print(menuBorderColor("__________________________________________________________________________________________________________\r\r"));
   print(menuColor("Questo comando serve a salvare, elminare, caricare una lista di colori o eliminare tutte le liste salvate.") + "\n");
   print(menuColor("Per salvare una lista:"));
   print(menuColor("'") + menuDataColor(cmd + " " + param + " save") + menuColor("'") + "\n");
   print(menuColor("Per eliminare una lista:"));
   print(menuColor("'") + menuDataColor(cmd + " " + param + " - 1") + menuColor("'"));
   print(menuColor("'") + menuDataColor(cmd + " " + param + " - 4") + menuColor("'") + "\n");
   print(menuColor("Per sostituire una lista:"));
   print(menuColor("'") + menuDataColor(cmd + " " + param + " 1") + menuColor("'") + "\n");
   print(menuColor("Per caricare una lista:"));
   print(menuColor("'") + menuDataColor(cmd + " " + param + " load 1") + menuColor("'"));
   print(menuColor("'") + menuDataColor(cmd + " " + param + " load 3") + menuColor("'") + "\n");
   print(menuColor("Per resettare le liste salvate:"));
   print(menuColor("'") + menuDataColor(cmd + " " + param + " reset") + menuColor("'"));
   print(menuBorderColor("__________________________________________________________________________________________________________\r\r"));
}

//Funzione che genera l'help del comando 'mode'
function modeHelp(cmd, param) {
   print(menuBorderColor("______________________________________________________________________\r\r"));
   print(menuColor("Questo comando serve a selezionare la modalità di utilizzo dei colori:") + "\n");
   print(menuColor("'") + menuDataColor("def") + menuColor("': utilizza un solo colore della lista di default."));
   print(menuColor("'") + menuDataColor("rand") + menuColor("': utilizza colori casuali della lista seq rand."));
   print(menuColor("'") + menuDataColor("seq") + menuColor("': utilizza sequenzialmente i colori della lista seq rand."));
   print(menuBorderColor("______________________________________________________________________\r\r"));
}

//Funzione usata per l'anteprima dettagliata di tutti i colori ed effetti presenti nel codice colore del mud
function codeColorHelpPreview() {
   let col1 = menuColor("Effetti disponibili:");
   let col2 = menuColor("Sfondi disponibili:");
   let col3 = menuColor("Colori disponibili:");
   print(col1 + " ".repeat(40 - strLen(col1)) + col2 + " ".repeat(40 - strLen(col2)) + col3);
   let len = MsgData.colorMgmt["mudColor"].length;
   for (let i = 0; i < len; i++) {
      col1 = colorHelpPreview("e",i); 
      col2 = colorHelpPreview("s",i);
      col3 = colorHelpPreview("c",i);
      print(col1 + " ".repeat(40 - strLen(col1)) + col2 + " ".repeat(40 - strLen(col2)) + col3);
   }      
}

//Funzione usata per controllare il numero dei parametri disponibili per un comando
function checkParamsNum(cmd,cmdIndex,len,min,max) {
  let cmdPos = cmdIndex + 1;
  switch (true) {
    case len > max:
      print(menuDataColor("* ") + menuColor("Ci sono troppi parametri per il comando '") + menuDataColor(cmd) + menuColor("', numero massimo: ") + menuDataColor(String(max - cmdPos)) + menuColor(".") +  "\r");
      return {"error": "Troppi parametri"};
      break;
    case len < min:
      let strParam = "";
      if (min == max) {
        strParam = " necessari: ";
      } else {
        strParam = " minimo: ";
      }
      print(menuDataColor("* ") + menuColor("Parametri insufficienti,") + menuColor(strParam) + menuDataColor(String(min - cmdPos)) + menuColor(".") + "\r");
      return {"error": "Parametri insufficienti"};
      break;
    default:
      return {"ok": "numero corretto di parametri"};
  }
}

//Funzione usata per cercare un array dentro un altro array
function arrayIncludes(array,arrLst) {
  for (const arr of arrLst) {
    if (array.toString() === arr.toString()) {return true} 
  }
  return false;
}

//Funzione che controlla se una stringa inizia con un codice colore del mud
function startWithColor(cmd,str) {
  if (!(/^\$c\d\d\d\d/gm.test(String(str))) && str != "nostring") {
    return "$c" + MsgData[cmd]["defColor"];
  } else {
    return "";
  }
}

//Sezione usata per gestire i vari comandi
switch (arrParams[1]) {
   //** Sezione comando 'status'
   case "status":
     if (arrParams.length == 2) {
       print(menuBorderColor("__________________________________________________________________________________________________________\r\r"));
       print(" ".repeat(35) + menuColor("Configurazione per il canale ") + colorPreview(cmd,MsgData.colorMgmt.cmdDefault[cmd][0]));
       print(menuBorderColor("----------------------------------------------------------------------------------------------------------\r\r"));
       print(menuColor("Modalità attiva: ") + menuDataColor(MsgData[cmd]["mode"]));
       print(menuColor("Colore base del canale: ") + colorPreview("",MsgData.colorMgmt.cmdDefault[cmd][0]));
       print(menuColor("Colore di default selezionato (") + menuDataColor("" + MsgData[cmd]["activeDefMudColor"]) + menuColor("): ") + defZeroPreview(cmd));
       print(menuColor("Stringa selezionata (") + menuDataColor("" + MsgData[cmd]["activeString"]) + menuColor("): ") + stringZeroPreview(cmd) + "\r");
       defaultsAndStringsPreview(cmd);
       print(" ");
       randseqAndListsPreview(cmd);
       print(menuBorderColor("__________________________________________________________________________________________________________\r\r"));
     } else {
       print(menuColor("Questo comando non accetta parametri."));
     }
     break;
   //** Sezione comando 'default'
   case "default":
     //Controllo se c'è solo il comando senza parametri
     if (arrParams.length > 2) {
       switch (true) {
         //Se il secondo parametro è '+'
         case arrParams[2] === "+":
           if (checkParamsNum("+",2,arrParams.length,4,6).error === undefined) {
             let check = colorCheck(...arrParams.slice(3));
             if (check.error === undefined) {
               if (!MsgData[cmd]["listDefMudColor"].includes(check)) {
                 //Non ci sono errori, inserisco il colore nella lista di default
                 MsgData[cmd]["listDefMudColor"].push(check);
                 print(menuColor("Eseguito.") + "\r");
               } else {
                 print(menuColor("Colore già presente, non verrà aggiunto.") + "\r");
               }
             } else {
               print(menuColor(check.error));
             }
           }
           //Fine della sezione del parametro '+'
           break;
         //Se il secondo parametro è '-'
         case arrParams[2] === "-":
           if (checkParamsNum("-",2,arrParams.length,4,4).error === undefined) {
             switch (true) {
               case MsgData[cmd]["listDefMudColor"][arrParams[3] - 1] !== undefined && /^\+|\-/gm.test(arrParams[3]) === false:
                 MsgData[cmd]["listDefMudColor"].splice((arrParams[3] - 1),1);
                 if (MsgData[cmd]["activeDefMudColor"] == arrParams[3]) {
                   MsgData[cmd]["activeDefMudColor"] = 0;
                 } else if (MsgData[cmd]["activeDefMudColor"] > arrParams[3]) {
                   MsgData[cmd]["activeDefMudColor"] = MsgData[cmd]["activeDefMudColor"] - 1;
                 }
                 print(menuColor("Eseguito.") + "\r");
                 break;
               default:
                 print(menuColor("Colore assente, non verrà eliminato.") + "\r");
             }
           } 
           //Fine della sezione del parametro '-'
           break;
         //Inizio sezione '<indice>'
         case MsgData[cmd]["listDefMudColor"][arrParams[2] - 1] !== undefined && /^\+|\-/gm.test(arrParams[2]) === false:
           if (checkParamsNum("sostituzione",2,arrParams.length,4,6).error === undefined) {
             let check = colorCheck(...arrParams.slice(3));
             if (check.error === undefined) {
               if (!MsgData[cmd]["listDefMudColor"].includes(check)) {
                 MsgData[cmd]["listDefMudColor"].splice((arrParams[2] - 1), 1, check);
                 if (arrParams[2] == MsgData[cmd]["activeDefMudColor"]) {MsgData[cmd]["activeDefMudColor"] = 0}
                 print(menuColor("Eseguito.") + "\r");
               } else {
                 print(menuColor("Colore già presente, non verrà sostituito.") + "\r");
               }
             } else {
               print(menuColor(check.error));
             }
           }
           //Fine della sezione del parametro '<indice>'
           break;
         //Inizio sezione 'set'
         case arrParams[2] === "set":
           if (checkParamsNum("set",2,arrParams.length,4,4).error === undefined) {
             switch (true) {
               case (arrParams[3] == 0 || MsgData[cmd]["listDefMudColor"][arrParams[3] - 1] !== undefined) && /^\+|\-/gm.test(arrParams[3]) === false:
                 MsgData[cmd]["activeDefMudColor"] = arrParams[3];
                 print(menuColor("Eseguito.") + "\r");
                 break;
               default:
                 print(menuColor("Colore assente, non verrà selezionato.") + "\r");
             }
           }
           //Fine della sezione del parametro 'set'
           break;
         //Inizio sezione 'reset'
         case arrParams[2] === "reset":
           //Se non c'è il parametro dopo il 'reset'
           if (arrParams[3] === undefined) {
             if (MsgData[cmd]["activeDefMudColor"] > 0) {MsgData[cmd]["activeDefMudColor"] = 0}
             MsgData[cmd]["listDefMudColor"] = [];
             print(menuColor("Eseguito.") + "\r");
           } else {
             //C'è un parametro dopo il 'reset'
             print(menuDataColor("* ") + menuColor("Il comando accetta un solo parametro.") + "\r");
           }
           //Fine della sezione 'reset'
           break;
         default:
           print(menuDataColor("* ") + menuColor("Comando non corretto, quelli disponibli sono '") + menuDataColor("+") + menuColor("', '") + menuDataColor("-") + menuColor("', (") + menuDataColor("posizione del colore nella lista") + menuColor("), '") + menuDataColor("set") + menuColor("' e '") + menuDataColor("reset") + menuColor("'.") + "\r");
       }//Fine della sezione dei parametri del comando 'default'
     } else {
       //Help del comando 'default'
       defaultHelp(cmd,arrParams[1]);
     }
     //** Fine sezione del comaando 'default'
     break;
   //** Sezione comando 'color'
   case "color":
     //Controllo se c'è solo il comando senza parametri
     if (arrParams.length > 2) {
       switch (true) {
         //Se il secondo parametro è '+'
         case arrParams[2] === "+":
           if (checkParamsNum("+",2,arrParams.length,4,6).error === undefined) {
             let check = colorCheck(...arrParams.slice(3));
             if (check.error === undefined) {
               MsgData[cmd]["listMudColor"].push(check);
               print(menuColor("Eseguito.") + "\r");               
             } else {
               print(menuColor(check.error));
             }
           }
           //Fine della sezione del parametro '+'
           break;
         //Se il secondo parametro è '-'
         case arrParams[2] === "-":
           if (checkParamsNum("-",2,arrParams.length,4,4).error === undefined) {
             switch (true) {
               case MsgData[cmd]["listMudColor"][arrParams[3] - 1] !== undefined && /^\+|\-/gm.test(arrParams[3]) === false:
                 MsgData[cmd]["listMudColor"].splice((arrParams[3] - 1),1);
                 print(menuColor("Eseguito.") + "\r");
                 break;
               default:
                 print(menuColor("Colore assente, non verrà eliminato.") + "\r");
             }
           } 
           //Fine della sezione del parametro '-'
           break;
         //Inizio sezione '<indice>'
         case MsgData[cmd]["listMudColor"][arrParams[2] - 1] !== undefined && /^\+|\-/gm.test(arrParams[2]) === false:
           if (checkParamsNum("sostituzione",2,arrParams.length,4,6).error === undefined) {
             let check = colorCheck(...arrParams.slice(3));
             if (check.error === undefined) {
               MsgData[cmd]["listMudColor"].splice((arrParams[2] - 1), 1, check);
               print(menuColor("Eseguito.") + "\r");
             } else {
               print(menuColor(check.error));
             }
           }
           //Fine della sezione del parametro '<indice>'
           break;
         //Inizio sezione 'reset'
         case arrParams[2] === "reset":
           //Se non c'è il parametro dopo il 'reset'
           if (arrParams[3] === undefined) {
             MsgData[cmd]["listMudColor"] = [];
             print(menuColor("Eseguito.") + "\r");
           } else {
             //C'è un parametro dopo il 'reset'
             print(menuDataColor("* ") + menuColor("Il comando accetta un solo parametro.") + "\r");
           }
           //Fine della sezione 'reset'
           break;
         default:
           print(menuDataColor("* ") + menuColor("Comando non corretto, quelli disponibli sono '") + menuDataColor("+") + menuColor("', '") + menuDataColor("-") + menuColor("', (") + menuDataColor("posizione del colore nella lista") + menuColor(") e '") + menuDataColor("reset") + menuColor("'.") + "\r");
       }//Fine della sezione dei parametri del comando 'color'
     } else {
       //Help del comando 'color'
       colorHelp(cmd,arrParams[1]);
     }  
     //** Fine sezione del comando 'color'
     break;
   //** Sezione comando 'string'
   case "string":
     //Controllo se c'è solo il comando senza parametri
     if (arrParams.length > 2) {
       switch (true) {
         //Se il secondo parametro è '+'
         case arrParams[2] === "+":
           if (checkParamsNum("+",2,arrParams.length,5,5).error === undefined) {
             let str1 = onlyColor(arrParams[3]);
             let str2 = onlyColor(arrParams[4]);
             if (stringCheck(cmd, str1, str2, MsgData[cmd]["startString"], MsgData[cmd]["endString"]).error !== undefined) {
               let sCol = startWithColor(cmd, str1);
               let eCol = startWithColor(cmd, str2);
               MsgData[cmd]["startString"].push(String(sCol + str1));
               MsgData[cmd]["endString"].push(String(eCol + str2));  
               print(menuColor("Eseguito.") + "\r");
             } else {
               print(menuColor("Stringa già presente, non verrà aggiunta.") + "\r");
             }            
           }
           //Fine della sezione del parametro '+'
           break;
         //Se il secondo parametro è '-'
         case arrParams[2] === "-":
           if (checkParamsNum("-",2,arrParams.length,4,4).error === undefined) {
             switch (true) {
               case MsgData[cmd]["startString"][arrParams[3] - 1] !== undefined && /^\+|\-/gm.test(arrParams[3]) === false:
                 MsgData[cmd]["startString"].splice((arrParams[3] - 1),1);
                 MsgData[cmd]["endString"].splice((arrParams[3] - 1),1);
                 if (MsgData[cmd]["activeString"] == arrParams[3]) {
                   MsgData[cmd]["activeString"] = 0;
                 } else if (MsgData[cmd]["activeString"] > arrParams[3]) {
                   MsgData[cmd]["activeString"] = MsgData[cmd]["activeString"] - 1;
                 }
                 print(menuColor("Eseguito.") + "\r");
                 break;
               default:
                 print(menuColor("Stringa assente, non verrà eliminata.") + "\r");
             }
           } 
           //Fine della sezione del parametro '-'
           break;
         //Inizio sezione '<indice>'
         case MsgData[cmd]["startString"][arrParams[2] - 1] !== undefined && /^\+|\-/gm.test(arrParams[2]) === false:
           if (checkParamsNum("sostituzione",2,arrParams.length,5,5).error === undefined) {
             let str1 = onlyColor(arrParams[3]);
             let str2 = onlyColor(arrParams[4]);
             if (stringCheck(cmd, str1, str2, MsgData[cmd]["startString"], MsgData[cmd]["endString"]).error !== undefined) {
               let sCol = startWithColor(cmd, str1);
               let eCol = startWithColor(cmd, str2);
               MsgData[cmd]["startString"].splice((arrParams[2] - 1), 1,String(sCol + str1));
               MsgData[cmd]["endString"].splice((arrParams[2] - 1), 1,String(eCol + str2));
               if (arrParams[2] == MsgData[cmd]["activeString"]) {MsgData[cmd]["activeString"] = 0} 
               print(menuColor("Eseguito.") + "\r");
             } else {
               print(menuColor("Stringa già presente, non verrà sostituita.") + "\r");
             }            
           }
           //Fine della sezione del parametro '<indice>'
           break;
         //Inizio sezione 'set'
         case arrParams[2] === "set":
           if (checkParamsNum("set",2,arrParams.length,4,4).error === undefined) {
             switch (true) {
               case (arrParams[3] == 0 || MsgData[cmd]["startString"][arrParams[3] - 1] !== undefined) && /^\+|\-/gm.test(arrParams[3]) === false:
                 MsgData[cmd]["activeString"] = arrParams[3];
                 print(menuColor("Eseguito.") + "\r");
                 break;
               default:
                 print(menuColor("Stringa assente, non verrà selezionata.") + "\r");
             }
           }
           //Fine della sezione del parametro 'set'
           break;
         //Inizio sezione 'reset'
         case arrParams[2] === "reset":
           //Se non c'è il parametro dopo il 'reset'
           if (arrParams[3] === undefined) {
             if (MsgData[cmd]["activeString"] > 0) {MsgData[cmd]["activeString"] = 0}
             MsgData[cmd]["startString"] = [];
             MsgData[cmd]["endString"] = [];
             print(menuColor("Eseguito.") + "\r");
           } else {
             //C'è un parametro dopo il 'reset'
             print(menuDataColor("* ") + menuColor("Il comando accetta un solo parametro.") + "\r");
           }
           //Fine della sezione 'reset'
           break;
         default:
           print(menuDataColor("* ") + menuColor("Comando non corretto, quelli disponibli sono '") + menuDataColor("+") + menuColor("', '") + menuDataColor("-") + menuColor("', (") + menuDataColor("posizione del colore nella lista") + menuColor("), '") + menuDataColor("set") + menuColor("' e '") + menuDataColor("reset") + menuColor("'.") + "\r");
       }//Fine della sezione dei parametri del comando 'string'
     } else {
       //Help del comando 'string'
       stringHelp(cmd,arrParams[1]);
     }
     //** Fine sezione del comando 'string'
     break;
   //** Sezione comando 'list'
   case "list":
     //Controllo se c'è solo il comando senza parametri
     if (arrParams.length > 2) {
       switch (true) {
         //Se il secondo parametro è 'save'
         case arrParams[2] === "save":
           if (checkParamsNum("save",2,arrParams.length,3,3).error === undefined) {
             if (MsgData[cmd]["listMudColor"].length > 0) {
               if (!arrayIncludes(MsgData[cmd]["listMudColor"],MsgData[cmd]["listsMudColor"])) {
                 MsgData[cmd]["listsMudColor"].push([...MsgData[cmd]["listMudColor"]]);
                 print(menuColor("Eseguito.") + "\r");               
               } else {
                 print(menuColor("Lista già presente, non verrà aggiunta.") + "\r");
               }
             } else {
               print(menuColor("Lista colori vuota, non verrà aggiunta.") + "\r");
             }
           }
           //Fine della sezione del parametro '+'
           break;
          //Se il secondo parametro è 'load'
          case arrParams[2] === "load":
           if (checkParamsNum("load",2,arrParams.length,4,4).error === undefined) {
             if (MsgData[cmd]["listsMudColor"].length > 0) {
               if (MsgData[cmd]["listsMudColor"][arrParams[3] - 1] !== undefined && /^\+|\-/gm.test(arrParams[3]) === false) {
                 MsgData[cmd]["listMudColor"] = [...MsgData[cmd]["listsMudColor"][arrParams[3] - 1]];
                 print(menuColor("Eseguito.") + "\r");               
               } else {
                 print(menuColor("La lista non esiste, non verrà caricata.") + "\r");
               }
             } else {
               print(menuColor("Nessuna lista salvata, non verrà caricata.") + "\r");
             }
           }
           //Fine della sezione del parametro 'load'
           break;
         //Se il secondo parametro è '-'
         case arrParams[2] === "-":
           if (checkParamsNum("-",2,arrParams.length,4,4).error === undefined) {
             switch (true) {
               case MsgData[cmd]["listsMudColor"][arrParams[3] - 1] !== undefined && /^\+|\-/gm.test(arrParams[3]) === false:
                 MsgData[cmd]["listsMudColor"].splice((arrParams[3] - 1),1);
                 print(menuColor("Eseguito.") + "\r");
                 break;
               default:
                 print(menuColor("Lista assente, non verrà eliminata.") + "\r");
             }
           } 
           //Fine della sezione del parametro '-'
           break;
         //Inizio sezione '<indice>'
         case MsgData[cmd]["listsMudColor"][arrParams[2] - 1] !== undefined && /^\+|\-/gm.test(arrParams[2]) === false:
           if (checkParamsNum("sostituzione",2,arrParams.length,3,3).error === undefined) {
             if (MsgData[cmd]["listMudColor"].length > 0) {
               if (!arrayIncludes(MsgData[cmd]["listMudColor"],MsgData[cmd]["listsMudColor"])) {
                 MsgData[cmd]["listsMudColor"].splice((arrParams[2] - 1), 1, [...MsgData[cmd]["listMudColor"]]);
                 print(menuColor("Eseguito.") + "\r");               
               } else {
                 print(menuColor("Lista già presente, non verrà sostituita.") + "\r");
               }
             } else {
               print(menuColor("Lista colori vuota, non verrà sostituita.") + "\r");
             }
           }
           //Fine della sezione del parametro '<indice>'
           break;
         //Inizio sezione 'reset'
         case arrParams[2] === "reset":
           //Se non c'è il parametro dopo il 'reset'
           if (arrParams[3] === undefined) {
             MsgData[cmd]["listsMudColor"] = [];
             print(menuColor("Eseguito.") + "\r");
           } else {
             //C'è un parametro dopo il 'reset'
             print(menuDataColor("* ") + menuColor("Il comando accetta un solo parametro.") + "\r");
           }
           //Fine della sezione 'reset'
           break;
         default:
           print(menuDataColor("* ") + menuColor("Comando non corretto, quelli disponibli sono '") + menuDataColor("save") + menuColor("', '") + menuDataColor("load") + menuColor("', '") + menuDataColor("-") + menuColor("', (") + menuDataColor("posizione del colore nella lista") + menuColor(") e '") + menuDataColor("reset") + menuColor("'.") + "\r");
       }//Fine della sezione dei parametri del comando 'list'
     } else {
       //Help del comando 'list'
       listHelp(cmd,arrParams[1]);
     }  
     //** Fine sezione del comando 'list'
     break;
   //** Sezione comando 'mode'
   case "mode":
     //Controllo se c'è solo il comando senza parametri
     if (arrParams.length > 2) {
       if (checkParamsNum("mode",1,arrParams.length,3,3).error === undefined) {
         switch (arrParams[2]) {
           case "def":
             MsgData[cmd]["mode"] = "def";
             print(menuColor("Eseguito.") + "\r");
             break;
           case "rand":
             MsgData[cmd]["mode"] = "rand";
             print(menuColor("Eseguito.") + "\r");
             break;
           case "seq":
             MsgData[cmd]["mode"] = "seq";
             print(menuColor("Eseguito.") + "\r");
             break;
           default:
             print(menuColor("Modalità sconosciuta, quelle disponibili sono: ") + menuColor("'") + menuDataColor("def") + menuColor("', '") + menuDataColor("rand") + menuColor("' e '") + menuDataColor("seq") + menuColor("'.") + "\r");
         }
       } 
     } else {
       //Help del comando 'mode'
       modeHelp(cmd,arrParams[1]);
     }  
     //** Fine sezione del comando 'mode'
     break;
}
