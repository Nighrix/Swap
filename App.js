
async function main() {
  renderSwapOptions();
}


var tradeSlots = [
  ["Pulse",""], // Name
  ["TPLS",""], // Symbol
];

//this contains all the possible selectable tokens
// Slot 0|0  and 0|1 are set with the main token

var tokensCache = [
  ["Pulse"], // Name
  ["TPLS"], // Symbol
];





// When you edit the first token slot this is 0
// for the second its 1
var openSelectorIndex = 0;


async function renderToTokenSelector(index) {
  
  var selectableTokenSelector = document.getElementById("InputField_"+index);
  var resultText = "";
  var resultTextMaxButton = "";
  var resultTextSymbol = "Select a currency";
  
  if(index == 0) {
    resultTextMaxButton = '<button type="button" class="TokenSelector ColorMode_0" onclick="setMaxBalance(0);">MAX</button>';   
  } 
  if(tradeSlots[1][index] != "") {
    resultTextSymbol = tradeSlots[1][index];
  }
  
  
   resultText += `
   
      <input type="number" id="input_0" name="Input_0" class="SwapInputField" placeholder="0.0" onkeydown="validateNumber(event);" />
      
      ` + resultTextMaxButton + `
      
      <button type="button" class="TokenSelector" onclick="openTokenSelector(` + index + `);" >` + resultTextSymbol + `</button>
   
   `;
    
  
  
  selectableTokenSelector.innerHTML = resultText;
  
}


async function renderSwapOptions() {
  
  renderToTokenSelector(0);
  renderToTokenSelector(1);
  
  
  
}



async function connectWeb3() {

        window.web3 = await new Web3("https://rpc.testnet.pulsechain.com");
        

        try {
          await window.ethereum.enable();
           
          console.log("CONNECTED !");
          await onConnect();
          
          getTokenBalance();
               
          
        } catch (error) {
          console.log(error);
          
          return;
        }
        
      
    
  }
 
   var tokenSelectedIndex = 0;
  
   
   async function setMaxBalance(targetIndex) {
     
     var swapBalance = await document.getElementById("input_"+targetIndex);
     var balance = 0;
      try {
         balance = await getActiveTokensBalance();
      } catch(error) {
        console.warn("No wallet connected !");
      }
      
      
      swapBalance.value  = balance;
      
   }
   
  // This returns the active balance
  async function getActiveTokensBalance() {
    var activeBalance = 0;
     // TPLS Token
     if(tokenSelectedIndex == 0) {
      var accounts = await web3.eth.getAccounts();
      
      var balance =  await web3.eth.getBalance(accounts[0]);
      
      
      activeBalance = web3.utils.fromWei(balance);
    } else { // Other tokens
      
      
    }
    return activeBalance;
  }
   
  // This renders the active balance
  async function activeTokensBalance(){
    
      console.log("Try fetching balance");
     
      var activeBalance = 0;
      activeBalance = await getActiveTokensBalance();
     
      
      var swapBalance_0 = await document.getElementById("Balance_0");
      
      swapBalance_0.innerHTML = "Balance: " + activeBalance;
      
      
      
      
      console.log("Balance fetched successfully");
      
      
}

  
 async function onConnect() {
      // Change button states
      
      var buttonChangeStateCollection = document.getElementsByClassName("ConnectButton");
     for(var i = 0;i < buttonChangeStateCollection.length;i++) { 
        buttonChangeStateCollection[i].innerHTML = "Connected";
     }
     
      buttonChangeStateCollection = document.getElementsByClassName("Swap");
      for(var i = 0;i < buttonChangeStateCollection.length;i++) { 
         buttonChangeStateCollection[i].innerHTML = "Swap";
                                                                             // This is important for the callSwap() function
         buttonChangeStateCollection[i].classList.add("CanSwap");
      }
      
      
     
     
     
     activeTokensBalance();
     
     setTimeout(activeTokensBalance, 500);
     
 }
 
 async function callSwap(activeElement) {
    if(!activeElement.classList.contains("CanSwap")) {
      console.log("Swap is not available yet !"); 
      return;
    }
   
    console.log("Swap is available"); 
  
    
  
  
 }
 
 
 
 
 
 
 
 
 
 
  
  
  
  async function getTokenBalance() {
    var accounts = await web3.eth.getAccounts();
    var balance = await web3.eth.getBalance(accounts[0])
         
    console.log(accounts[0] + " Balance: ", web3.utils.fromWei(balance)) 
    
    return web3.utils.fromWei(balance);
 }
  
  
 

async function openTokenSelector(targetIndex) {
     openSelectorIndex = targetIndex;
     changeTokenSelectorVisibility();
}
  
  async function changeTokenSelectorVisibility() {
      findClosestAdressMatch();
      
      
      var TokenSelectorWindow = document.getElementById("TokenSelectorWindow");
      if(TokenSelectorWindow.style.display == "none") {
         TokenSelectorWindow.style.display = "flex";
         
         renderSelectableTokens(tokensCache);
         
         const input = document.getElementById('adress_input');
         input.focus();
         
         
      } else {
         TokenSelectorWindow.style.display = "none";
      }
      
      
      console.log(openSelectorIndex);
}

async function onSelectToken(name) {
    changeTokenSelectorVisibility(); // Hide activeWindow
    
    tradeSlots[0][openSelectorIndex] = name; // name
    tradeSlots[1][openSelectorIndex] = name; // symbol [Add new variable reference in the functions head for the symbol]
    
    renderToTokenSelector(openSelectorIndex);

    console.log(tradeSlots);
}



async function renderSelectableTokens(activeList) {
     var selectableTokenSelector = document.getElementById("SelectableTokensContainer");
     var resultText = "";
     
     
     for(var i = 0;i < activeList[0].length;i++) {
      
      resultText += `
      
      <div class="TokenInfo" onclick="onSelectToken('` + String(activeList[1][i]) + `');")>
           <img src="images/unknownIcon.png" alt="Italian Trulli" style="width:25px;height:25px;">
           <div class="InfoContainer">
              <tokenInfoTop>` + activeList[0][i] + `</tokenInfoTop>
              <tokenInfoBottom>` + activeList[1][i] + `</tokenInfoBottom>
           </div>
           
      </div>
      
      `;
       
     }
     
     
     
     
     
     selectableTokenSelector.innerHTML = resultText;
}

async function renderNoResultsFound() {
  var selectableTokenSelector = document.getElementById("SelectableTokensContainer");
  var resultText = "";
  
  resultText += `
      <div class="TokenNoResult">
          No results found.
       </div>
  `;
  
  
  
  selectableTokenSelector.innerHTML = resultText;
  
}






async function fetchURL(fetchLink) {
    var response = await fetch(fetchLink);
    switch (response.status) {
        // status "OK"
        case 200:
            var responeText = JSON.parse(await response.text());
            
            console.log(responeText);
            return responeText;
            break;
        // status "Not Found"
        case 404:
            return "NOT FOUND";
            break;
    }

return "FAILED";
  
}


async function findClosestAdressMatch() {
   var inputField = document.getElementById("adress_input");
   
   // If input is empty
   if(inputField.value == "") {
     // Here you send the selectable tokens as tokensCache and they will be rendered
    renderSelectableTokens(tokensCache);
   } else {
     
    
   var fetchLink = "https://scan.pulsechain.com/api?module=token&action=getToken&contractaddress=" + inputField.value;
   var fetchResult = await fetchURL(fetchLink);
   console.log(fetchResult);
    
  if(fetchResult.status == 1) {
     var tokensCache2 = [
       [fetchResult.result.name], // Name
      [fetchResult.result.symbol], // Symbol
     ]
   
     renderSelectableTokens(tokensCache2);
    
  } else {
    renderNoResultsFound();
    
    
  }
    
    
    
    
    
    
   }
}














