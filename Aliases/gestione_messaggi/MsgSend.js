//Class: StrMsg
//Enabled: true
//ID: MsgSend
//Propmt: false
//Script: true
//Pattern: "^\s*(emo|gossip|gt|gui|herogoss|mess|ot|say|send|shout|si|tele|tell|whi)(?=\s|$)\s?(\s*[^\s]+\s?)?(.+)?"
//Regex: true

let headParam = $2;
let tailParams = $3;
let fullParams = $2 + $3;
let sendSilent = true;
//Divido i parametri in un array
//let arrParams = params.trim().split(/\s+/);
//Se non ci sono parametri, split restituisce una stringa vuota e in questo caso setto params come
//vettore vuoto per poterne controllare la lunghezza
//if (arrParams == "") {arrParams = [];}
//Controllo se esiste la lista dei comandi.
if (typeof MsgData == 'undefined') {
      this.MsgData = {};
      MsgData.menuMgmt = {};
      MsgData.menuMgmt["cmds"] = ["color","default","string","list","mode","status"];
}
//Controllo se ci sono parametri
if (headParam.trim() != "") {
   //** Ci sono parametri
   //Controllo se le variabili necessarie esistono;
   //cmd è usato per calcolare i caratteri disponibili nel buffer e per indicare all'alias che 
   //gestisce i comandi il tipo di messaggio di riferimento
   let cmd = match[1];
   if (typeof MsgData.colorMgmt == 'undefined') {
      MsgData.colorMgmt = {};
      MsgData.colorMgmt["cmdDefault"] = {
                                          "emo": ["0015","emote",1],
                                          "gossip": ["0011","gossip",1],
                                          "gt": ["0012","gt",1],
                                          "gui": ["0014","gui",1],
                                          "herogoss": ["0011","herogoss",1],
                                          "mess": ["0013","messenger",0],
                                          "ot": ["0002","ot",1],
                                          "say": ["0015","say",1],
                                          "send": ["0013","send",0],
                                          "shout": ["0009","shout",1],
                                          "si": ["0002","sign",1],
                                          "tele": ["0013","telepathy",0],
                                          "tell": ["0013","tell",0],
                                          "whi": ["0005","whisper",0]
                                        };
      MsgData.colorMgmt["cliEffects"] = ["nofx","high","under","blink","reverse"];
      MsgData.colorMgmt["mudEffects"] = ["0","1","4","5","6"];
      MsgData.colorMgmt["cliBgr"] = ["#000","#bb0000","#00bb00","#bbbb00","#1616e2","#bb00bb","#00bbbb","#c0c0c0"];
      MsgData.colorMgmt["mudBgr"] = ["0","1","2","3","4","5","6","7"];
      MsgData.colorMgmt["cliColor"] = ["#000","#bb0000","#00bb00","#bbbb00","#1616e2","#bb00bb","#00bbbb","#c0c0c0","#808080","#ff0000","#00ff00","#ffff00","#6464ff","#ff00ff","#00ffff","#ffffff"];
      MsgData.colorMgmt["cliHighColor"] = ["#808080","#ff0000","#00ff00","#ffff00","#6464ff","#ff00ff","#00ffff","#ffffff","#808080","#ff0000","#00ff00","#ffff00","#6464ff","#ff00ff","#00ffff","#ffffff"];
      MsgData.colorMgmt["mudColor"] = ["00","01","02","03","04","05","06","07","08","09","10","11","12","13","14","15"];
      MsgData.colorMgmt["cmdBgr"] = ["bg-nero","bg-rosso","bg-verde","bg-marrone","bg-blu","bg-magenta","bg-ciano","bg-grigio"];
      MsgData.colorMgmt["cmdColor"] = ["nero","rosso-scuro","verde-scuro","marrone","blu-scuro","magenta-scuro","azzurro-ciano-scuro","grigio-chiaro","grigio-scuro","rosso-chiaro","verde-chiaro","giallo","blu-chiaro","magenta-chiaro","azzurro-ciano-chiaro","bianco"];
   }
   if (typeof MsgData[cmd] == 'undefined') {
      MsgData[cmd] = {};
      MsgData[cmd]["defColor"] = MsgData.colorMgmt.cmdDefault[cmd][0];
      //Lista dei colori per la modalità "rand" e "seq"
      MsgData[cmd]["listMudColor"] = [];
      MsgData[cmd]["mode"] = "def";
      MsgData[cmd]["startString"] = [];
      MsgData[cmd]["endString"] = [];
      MsgData[cmd]["activeString"] = 0;
      MsgData[cmd]["activeDefMudColor"] = 0;
      //Lista dei colori per la modalità "def"
      MsgData[cmd]["listDefMudColor"] = [];
      MsgData[cmd]["listsMudColor"] = [];
   }
   if (typeof MsgData.menuMgmt["dataColor"] == 'undefined') {
      MsgData.menuMgmt["dataColor"] = "azzurro-ciano-scuro";
      MsgData.menuMgmt["menuColor"] = "magenta-scuro";
      MsgData.menuMgmt["infoColor"] = "azzurro-ciano-scuro";
      MsgData.menuMgmt["borderColor"] = "magenta-scuro";
   }
   if (typeof MsgData.strMgmt == 'undefined') {
      MsgData.strMgmt = {};
      MsgData.strMgmt["maxChar"] = 510;
   } 
   //Controllo se il primo parametro fa parte dei comandi selezionabili
   if (MsgData.menuMgmt["cmds"].includes(headParam.trim())) {
     //** Il primo parametro è un comando
     send("msgmgmt " + cmd + " " + fullParams);
   } else {
     //** Il primo parametro non è un comando
     //Funzione che aggiungere i colori al messaggio.
     //Insieme al colore viene anteposto un codice nullo $c0000 per resettare gli effetti di codici precedenti
     //che altrimenti resterebbero attivi anche ai codici successivi con effetti attivi.
     function addColor(cmd,str) {
        //Variabile che conterrà il messaggio
        let msg = "";
        switch (MsgData[cmd]["mode"]) {
           case "def":
             //Controllo che il colore scelto non sia quello di base ed esista nella lista e lo 
             //aggiungo dopo ogni spazio
             if (MsgData[cmd]["activeDefMudColor"] > 0 && MsgData[cmd]["listDefMudColor"].length >= MsgData[cmd]["activeDefMudColor"]) {
               //Colore non di default e presente in lista, aggiungo il colore
               msg = str.replace(/\s+/gm, function(match) {
                                                return match + "$c" + MsgData[cmd]["listDefMudColor"][MsgData[cmd]["activeDefMudColor"] - 1];
                                             });
               //Aggiungo il colore all'inizio del messaggio per preservare gli spazi iniziali che andrebbero
               //persi con la funzione send
               msg = "$c0000$c" + MsgData[cmd]["listDefMudColor"][MsgData[cmd]["activeDefMudColor"] - 1] + msg;
               return msg;
             } else {
               //Colore di base selezionato, aggiungo il colore
               msg = str.replace(/\s+/gm, function(match) {
                                                return match + "$c" + MsgData[cmd]["defColor"];
                                             });
               //Aggiungo il colore all'inizio del messaggio per preservare gli spazi iniziali che andrebbero
               //persi con la funzione send
               msg = "$c0000$c" + MsgData[cmd]["defColor"] + msg;
               return msg;
             }
             break;
           case "rand":
             //Controllo che la lista abbia elementi e aggiungo un colore casuale dopo ogni spazio
             if (MsgData[cmd]["listMudColor"].length > 0) {
               //La lista contiene elementi. aggiungo un colore casuale
               msg = str.replace(/\s+/gm, function(match) {
                                                return match + "$c0000$c" + MsgData[cmd]["listMudColor"][Math.floor(Math.random() * MsgData[cmd]["listMudColor"].length)];
                                             });
               //Aggiungo il colore all'inizio del messaggio per preservare gli spazi iniziali che andrebbero
               //persi con la funzione send
               msg = "$c0000$c" + MsgData[cmd]["listMudColor"][Math.floor(Math.random() * MsgData[cmd]["listMudColor"].length)] + msg;
               return msg;
             } else {
               //La lista è vuota, aggiungo il colore base
               msg = str.replace(/\s+/gm, function(match) {
                                                return match + "$c" + MsgData[cmd]["defColor"];
                                             });
               //Aggiungo il colore all'inizio del messaggio per preservare gli spazi iniziali che andrebbero
               //persi con la funzione send
               msg = "$c0000$c" + MsgData[cmd]["defColor"] + msg;
               return msg;
             }
             break;
           case "seq":
             //Controllo che la lista abbia elementi e aggiungo i colori
             if (MsgData[cmd]["listMudColor"].length > 0) {
               //La lista contiene elementi, aggiungo i colori sequenzialmente
               let colorIndex = 0;
               let offset = 0;
               //Se la stringa non inizia con uno spazio inizializzo indice con il secondo colore, se c'è, ed
               //il primo colore verrà assegnato al codice aggiunto ad ogni inizio match
               if (!str.startsWith(' ') && MsgData[cmd]["listMudColor"].length > 1) {
                  colorIndex = 1;
                  offset = 1;
               }
               //Lindice viene aumentato o diminuito con un offset che cambia con il primo e l'ultimo elemento del vettore
               msg = str.replace(/\s+/gm, function(match) {
                                                let res = match + "$c0000$c" + MsgData[cmd]["listMudColor"][colorIndex];
                                                if (colorIndex == 0 && MsgData[cmd]["listMudColor"].length > 1) {offset = 1}
                                                if (colorIndex == MsgData[cmd]["listMudColor"].length - 1 && MsgData[cmd]["listMudColor"].length > 1) {offset = -1}
                                                colorIndex = colorIndex + offset;
                                                return res;
                                             })
               //Aggiungo il colore all'inizio del messaggio per preservare gli spazi iniziali che andrebbero
               //persi con la funzione send
               msg = "$c0000$c" + MsgData[cmd]["listMudColor"][0] + msg;
               return msg;
             } else {
               //La lista è vuota, aggiungo il colore base
               msg = str.replace(/\s+/gm, function(match) {
                                                return match + "$c" + MsgData[cmd]["defColor"];
                                             })
               //Aggiungo il colore all'inizio del messaggio per preservare gli spazi iniziali che andrebbero
               //persi con la funzione send
               msg = "$c0000$c" + MsgData[cmd]["defColor"] + msg;
               return msg;
             }                                 
             break;
           default:
              msg = str.replace(/\s+/gm, function(match) {
                                                return match + "$c" + MsgData[cmd]["defColor"];
                                             })
               //Aggiungo il colore all'inizio del messaggio per preservare gli spazi iniziali che andrebbero
               //persi con la funzione send
               msg = "$c0000$c" + MsgData[cmd]["defColor"] + msg;
               return msg;
         }
         
     }//Fine funzione addColor()
     //Funzione che assembla il messaggio finale e lo invia
     function sendMsg(cmd, headParam,tailParams) {
        //Variabile che indica se il comando ha un target o meno
        let noTarget = 0;
        let freeChar = MsgData.strMgmt["maxChar"];
        let sStr = "";
        let eStr = "";
        //Controllo se il comando ha un target o meno e setto la relativa variabile, nel caso avesse un target
        //diminuisco i caratteri disponibili perché il mud, per il comando "messenger" che ha un target,
        //tronca il messaggio a 510 caratteri ma nella stringa del messaggio inviato al target e al mittente
        //risultano dimensioni diverse. Ho diminuito i caratteri disponibii finché non ho riscontrato
        //più errori.
        if (MsgData.colorMgmt.cmdDefault[cmd][2] == 1) {noTarget = 1} {freeChar = freeChar - 70}
        //Sottraggo la quantità di caratteri, dal totale disponibile, della stringa aggiuntiva iniziale e finale
        //perché sono caratteri aggiunti dopo la regex
        //Controllo se c'è una stringa attiva e se è presente in lista
        if (MsgData[cmd]["activeString"] > 0 && MsgData[cmd]["startString"].length >= MsgData[cmd]["activeString"]) {
          //Assegno entrambe le stringhe a due variabili da usare nell'assemblamento della stringa finale
          if (MsgData[cmd]["startString"][MsgData[cmd]["activeString"] - 1] != "nostring") {
            sStr = MsgData[cmd]["startString"][MsgData[cmd]["activeString"] - 1] + " "; 
          } else {
            sStr = "";
          }
          if (MsgData[cmd]["endString"][MsgData[cmd]["activeString"] - 1] != "nostring") {
            eStr = " " + MsgData[cmd]["endString"][MsgData[cmd]["activeString"] - 1];
          } else {
            eStr = "";
          }
          //Controllo se c'è il carattere $ e la sua quantità perché il mud lo duplica e conta per due caratteri
          freeChar = freeChar - ((sStr + eStr).match(/\$/gm)||[]).length;
          //Controllo la lunghezza della stringa iniziale e finale e la sottraggo al totale
          freeChar = freeChar - (sStr + eStr).length;
        }
        //Sottraggo dai caratteri disponibili i caratteri del comando con lo spazio, il codice colore 
        //iniziale e finale e il possibile carattere dollaro diviso su più stringhe
        freeChar = freeChar - (28 + MsgData.colorMgmt.cmdDefault[cmd][1].length + 1 + 1);
        if (freeChar > 0) {
          let target = "";
          let colMsg = "";
          //Controllo se il comando ha un target o meno ed in caso lo separo dal messaggio
          if (noTarget == 1) {
            colMsg = addColor(cmd, fullParams);
          } else {
            target = headParam.trim() + " ";
            colMsg = addColor(cmd, tailParams);
            freeChar = freeChar - target.length;
          }
          //Regex per dividere il messaggio in base allo spazio disponibile
          //La regex cerca di prendere più caratteri possibili evitando di catturare parti di codice colore ma
          //solo parole intere con codice colore intero. Se i caratteri disponibili non sono sufficienti a catturare il
          //codice colore più una parola intera con lo spazio adiacente, o più volte questa sequenza, verrà catturata
          //parte della parola finché non viene acquisita tutta, divisa su più messaggi.
          let splitBuffRegex = new RegExp("((?<=^|\\s)(?:(?:\\$\\$c0000)?\\$\\$c\\d\\d\\d\\d))?((?:.{1," + freeChar + "}(?:(?<=\\s)(?!\\s)|$))|.{1," + freeChar + "})?", "gm");
          //Duplico il carattere $ considerato doppio per il mud in modo da avere un conteggio preciso nella regex
          colMsg = colMsg.replace(/\$/gm, "$$$$");
          //Elimino il codice colore alla fine della stringa
          colMsg = colMsg.replace(/\s\$\$c\d\d\d\d$/gm, " ");
          //Controllo che la stringa rispetti la dimensione massima del buffer, in caso contrario la divido in più parti e
          //il risultato lo inserisco in un vettore contenente i gruppi di acquisizione
          let arrMsg = [...colMsg.matchAll(splitBuffRegex)];
          //Variabile usata per indicare quale simbolo $ tenere o cancellare se diviso su più stringhe
          let rmDollar = 0;
          //Variabile usata per contenere il codice colore iniziale dopo avere sostituito il doppio $
          let startColor = "";
          //Variabile usata per contenere il corpo del messaggio preso dalla regex
          let bodyMsg = "";
          //Ciclo che controlla tutti i match della regex e assembla il messaggio finale
          for (const regexGroups of arrMsg) {
            //Catturo il codice colore iniziale e sostituisco il doppio $ con un solo $
            if (regexGroups[1] != undefined) {
              //Se manca un codice nullo $c0000 all'inizio di un match, lo aggiungo
              let resetColor = "";
              if (/^\$\$c\d\d\d\d$/gm.test(regexGroups[1])) {resetColor = "$c0000"}
              startColor = resetColor + regexGroups[1].replace(/\$\$/gm, "$$")
            }
            //Trovo il gruppo con il messaggio e sostituisco il doppio $ con un solo $, e riporto il messaggio allo
            //stato originale. Considerando che il doppio $ in origine è solo un $ nella regex una coppia può essere
            //divisa in due match e per questo un $ viene lasciato e l'altro viene eliminato in modo da avere un solo
            //carattere $, come dovrebbe essere.
            if (regexGroups[2] != undefined) {
              bodyMsg = regexGroups[2].replace(/\$\$|\$/gm, function(match) {
                                                               switch (match) {
                                                                 case "$$":
                                                                   return "$";
                                                                   break;
                                                                 case "$":
                                                                   if (rmDollar == 0) {
                                                                     rmDollar = 1;
                                                                     return "$";
                                                                   } else {
                                                                     rmDollar = 0;
                                                                     return "";
                                                                   }
                                                                   break;
                                                               }
                                                            })
              if (bodyMsg != "") {
                send("~" + MsgData.colorMgmt.cmdDefault[cmd][1] + " " + target + sStr + startColor + bodyMsg + eStr + "$c0000$c" + MsgData[cmd]["defColor"], sendSilent);
              }
            }
          }//Fine del for
        } else {
          print("Spazio disponibile per inserire il messaggio < 1" + "\n");
        }//Se freeChar > 0
     }//Fine della funzione sendMsg 
     sendMsg(cmd, headParam, tailParams);
   }//Fine della sezione in cui si trova il messaggio da inviare
} else {
  //** Non ci sono parametri
  print(color("\nComandi disponibili: ","#bb00bb") + color(MsgData.menuMgmt["cmds"],"#00ffff") + "\n");
}
