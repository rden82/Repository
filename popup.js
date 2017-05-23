chrome.runtime.onMessage.addListener(function(request, sender) {
  function copyTextToClipboard(text) {
    var textArea = document.createElement("textarea");
    
    textArea.style.position = 'fixed';
    textArea.style.top = 0;
    textArea.style.left = 0;
    textArea.style.width = '2em';
    textArea.style.height = '2em';
    textArea.style.padding = 0;
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';
    textArea.style.background = 'transparent';
    textArea.value = text;

    document.body.appendChild(textArea);

    textArea.select();

    try {
      var successful = document.execCommand('copy');
      var msg = successful ? 'successful' : 'unsuccessful';
      console.log('Copying text command was ' + msg);
    } catch (err) {
      console.log('Oops, unable to copy');
    }

    document.body.removeChild(textArea);
  }
  
  if (request.action == "getSource") {
    var S = request.source;
    
    var Location = S[1];
    var $html = $(S[0]);
    var Branch = $html.find('button.btn.btn_mini').attr('onclick').split('branchName: \'')[1].split('\' }')[0].replace("\\","");
    
    if (Branch == '<default>') {
      Branch = 'master';
    }
	
	  var Channel = $html.find('.last.buildType').text();
	  var Assembly = $html.find('.contentWrapper').text().split( /#/ )[1];

	  var CSSVar = 'background-color: black; color: lime; font-weight: lighter; font-size: 16px;';
      var OS;
	  
	  switch (Channel.split('.').pop(-1)) {
		  case "win" : OS = "__Win7 x64__"; 
			break;
		  case "mac" : OS = "__MacOS 10.12__"; 
			break;
		  default: OS = "__Ubuntu 17.04__";		  
	  }
	
	var Result = OS + ": ветка %%" + Branch + ", Branded distributives > " + Channel + " >%% ((" + Location + " " + Assembly + " ))";
    var info = '<span style="font-weight: bold; font-size: 16px; color: white;">The following link copied into clipboard:</span><br>';
    var Str = '<span style="' + CSSVar + '">' + Result + '</span>';

    copyTextToClipboard(Result);

    message.innerHTML = info + Str;
  }
});

function onWindowLoad() {
  var message = document.querySelector('#message');

  chrome.tabs.executeScript(null, {
    file: "getPagesSource.js"
  }, function() {
    // If you try and inject into an extensions page or the webstore/NTP you'll get an error
    if (chrome.runtime.lastError) {
      message.innerText = 'There was an error injecting script : \n' + chrome.runtime.lastError.message;
    }
  });

}

window.onload = onWindowLoad;
