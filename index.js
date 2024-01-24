export let enableTTS = false;

// Marked
window.onload = function(){
    const chat_message = document.querySelector("#message");
    chat_message.innerHTML = marked.parse(chat_message.textContent);
}

function inputDivDynamic(){
  const inputDiv = document.querySelector("#input");

  if (inputDiv.children.length === 1 && inputDiv.children[0].tagName === "BR") {
    inputDiv.innerHTML = '';
  }
}

$("#input").on("focus", inputDivDynamic);
$("#input").on("blur", inputDivDynamic);

/* Modal */

// Open modal
$(".loading-container").bind("click", function() {
  settingsModal(true);
});

// Close modal
$("#disableTTS").bind("click", function() {
  settingsModal(false);
});


$('.ttsCheckbox').click(function(){
  if(enableTTS && $(this).prop("checked") == false){
      infoWarning("TTS desativado!", "O TTS foi desativado.")
      enableTTS = false;
      $(".ttsCheckbox").prop("checked", false);
  }else  {
    passwordModal(true);
  }
});

$("#confirmPassword").bind("click", function() {
  var passwordConfirm = confirmPassword();
  if(passwordConfirm == true){
    passwordModal(false);
  }
});

$("#closePasswordModal").bind("click", function() {
  passwordModal(false);
});

$("#closeSettingsModal").bind("click", function(){
  settingsModal(false);
  passwordModal(false);
});



export function settingsModal(enable) {
  const modal = document.querySelector("#settingsModal");
  const overlay = document.querySelector('#overlay');
   if (enable){
    overlay.style.display = 'block';
      modal.style.display = 'block';
      modal.style.animation = 'fadeIn 0.25s ease-in-out forwards';
      // Delaying the animation start to ensure display:block takes effect first
      setTimeout(() => {
        modal.style.opacity = '1';
      }, 260);

      var elementsToEnable = document.querySelectorAll('*:not(#settingsModal, #settingsModal *, #ttsModalPassword, ttsModalPassword *, body, head, html, #overlay, #overlay2)');
      elementsToEnable.forEach(function(element) {
        element.style.pointerEvents = 'none';
        element.style.userSelect = 'none';
      });
  }else {
    overlay.style.display = 'none';
    var elementsToEnable = document.querySelectorAll('*:not(#settingsModal, #settingsModal *, #ttsModalPassword, ttsModalPassword *, body, head, html, #overlay, #overlay2)');
    elementsToEnable.forEach(function(element) {
      element.style.pointerEvents = '';
      element.style.userSelect = '';
    });
    modal.style.animation = 'fadeOut 0.25s ease-in-out forwards';
    setTimeout(() => {
      modal.style.display = 'none';
      modal.style.opacity = '0';
    }, 260);
  }
}

export function passwordModal(enable) {
  const modal = document.querySelector("#ttsModalPassword");
  const overlay = document.querySelector("#overlay")
  const overlay2 = document.querySelector("#overlay2");
   if (enable){
    overlay2.style.display = 'block';
    overlay.style.display = 'none';
    modal.style.display = 'block';
    modal.style.animation = 'fadeIn 0.25s ease-in-out forwards';
    setTimeout(() => {
      modal.style.opacity = '1';
    }, 260);

    modal.style.pointerEvents = '';
    modal.style.userSelect = '';

    var elementsToDisable = modal.querySelectorAll('*');
    elementsToDisable.forEach(function (element) {
      element.style.pointerEvents = '';
      element.style.userSelect = '';
    });

    var elementsToDisable = document.querySelectorAll('*:not(#ttsModalPassword, #ttsModalPassword *, body, head, html, #overlay, #overlay2)');
    elementsToDisable.forEach(function(element) {
      element.style.pointerEvents = 'none';
      element.style.userSelect = 'none';
    });


  }else {
    overlay2.style.display = 'none';
    overlay.style.display = 'block';
    var elementsToEnable = document.querySelectorAll('#settingsModal *, #settingsModal');
    elementsToEnable.forEach(function(element) {
      element.style.pointerEvents = '';
      element.style.userSelect = '';
    });

    
    modal.style.animation = 'fadeOut 0.25s ease-in-out forwards';
    setTimeout(() => {
      modal.style.display = 'none';
      modal.style.opacity = '0';
    }, 260);
  }
}

function clickOutside(){
  $("#overlay").bind("click", function() {
    settingsModal(false);
  });
  $("#overlay2").bind("click", function() {
    passwordModal(false);
  });
}



clickOutside();

/* TTS */

function setVolume(audioElement){
  $(audioElement).on('timeupdate', function() {				
    var vol = 1,
    interval = 200; // 200ms interval
    if (audioElement.currentTime >= audioElement.duration * 0.99) {
        if (audioElement.volume == 1) {
            var intervalID = setInterval(function() {
	        // Reduce volume by 0.05 as long as it is above 0
	        // This works as long as you start with a multiple of 0.05!
	        if (vol > 0) {
	            vol -= 0.05;
	            // limit to 2 decimal places
                    // also converts to string, works ok
                    audioElement.volume = vol.toFixed(2);
	        } else {
	            // Stop the setInterval when 0 is reached
	            clearInterval(intervalID);
	        }
            }, interval);
        }
    }
});
}

const XI_API_KEY = 'f289db5d52aee96edb192f8afc841cfd';
const VOICE_ID = 'ATQd4vxdAX9JLua70mY3';

export function tts(text, enable) {
  if (enable){
    const textToSpeech = async (inputText) => {
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}?optimize_streaming_latency=2`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': XI_API_KEY
        },
        body: JSON.stringify({      
          "model_id": "eleven_multilingual_v2",
          "text": inputText,
          "voice_settings": {
            "similarity_boost": 0.75,
            "stability": 0.62,
            "style": 0.2,
            "use_speaker_boost": true
          } 
        })
      });
    
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    
      return response.body; // Return the ReadableStream
    };
    
    const playAudio = async (inputText) => {
      const audioStream = await textToSpeech(inputText);
      const audio = new Audio();
      audio.srcObject = audioStream;
      setVolume(audio);
      audio.play();
      let loadingCircle = document.querySelector(".maskedCircle");
      loadingCircle.style.animation = "reverseColor 1s linear forwards, reverseGlow 1s linear forwards, blink 1s infinite linear";
    };

    playAudio(text);
  }
}




export function successfulWarning(boldText, text){
    var warning = document.querySelector("#successfulWarning");
    var bold = warning.querySelector("strong");
    var normalText = warning.querySelector(".alert").lastChild;
    var fadeSpeed = 5000;
    normalText.textContent = ' ' + text;
    bold.textContent = boldText;
    warning.style.opacity = '0';
    warning.style.display = 'block';
    warning.style.animation = "fadeIn 0.5s ease-in-out forwards";
    warning.style.opacity = '1';
    $("#closeSuccessfulWarning").bind("click", function() {
      fadeSpeed = 0;
      setTimeout(() => {
        warning.style.animation = "fadeOut 0.5s ease-in-out forwards";
      }, fadeSpeed);
      
    setTimeout(() => {
        warning.style.display = 'none';
      }, fadeSpeed + 400);
    });

    setTimeout(() => {
        warning.style.animation = "fadeOut 0.5s ease-in-out forwards";
      }, fadeSpeed);
      
    setTimeout(() => {
        warning.style.display = 'none';
      }, fadeSpeed + 400);
}

export function infoWarning(boldText, text){
  var warning = document.querySelector("#infoWarning");
  var bold = warning.querySelector("strong");
  var normalText = warning.querySelector(".alert").lastChild;
  var fadeSpeed = 5000;
  normalText.textContent = ' ' + text;
  bold.textContent = boldText;
  warning.style.opacity = '0';
  warning.style.display = 'block';
  warning.style.animation = "fadeIn 0.5s ease-in-out forwards";
  warning.style.opacity = '1';
  $("#closeInfoWarning").bind("click", function() {
    fadeSpeed = 0;
    setTimeout(() => {
      warning.style.animation = "fadeOut 0.5s ease-in-out forwards";
    }, fadeSpeed);
    
  setTimeout(() => {
      warning.style.display = 'none';
    }, fadeSpeed + 400);
  });

  setTimeout(() => {
      warning.style.animation = "fadeOut 0.5s ease-in-out forwards";
    }, fadeSpeed);
    
  setTimeout(() => {
      warning.style.display = 'none';
    }, fadeSpeed + 400);
}

export function alertWarning(boldText, text){
  var warning = document.querySelector("#alertWarning");
  var bold = warning.querySelector("strong");
  var normalText = warning.querySelector(".alert").lastChild;
  var fadeSpeed = 5000;
  normalText.textContent = ' ' + text;
  bold.textContent = boldText;
  warning.style.opacity = '0';
  warning.style.display = 'block';
  warning.style.animation = "fadeIn 0.5s ease-in-out forwards";
  warning.style.opacity = '1';
  $("#closeAlertWarning").bind("click", function() {
    fadeSpeed = 0;
    setTimeout(() => {
      warning.style.animation = "fadeOut 0.5s ease-in-out forwards";
    }, fadeSpeed);
    
  setTimeout(() => {
      warning.style.display = 'none';
    }, fadeSpeed + 400);
  });

  setTimeout(() => {
      warning.style.animation = "fadeOut 0.5s ease-in-out forwards";
    }, fadeSpeed);
    
  setTimeout(() => {
      warning.style.display = 'none';
    }, fadeSpeed + 400);
}

export function errorWarning(boldText, text){
  var warning = document.querySelector("#errorWarning");
  var bold = warning.querySelector("strong");
  var normalText = warning.querySelector(".alert").lastChild;
  var fadeSpeed = 5000;
  normalText.textContent = ' ' + text;
  bold.textContent = boldText;
  warning.style.opacity = '0';
  warning.style.display = 'block';
  warning.style.animation = "fadeIn 0.5s ease-in-out forwards";
  warning.style.opacity = '1';
  $("#closeErrorWarning").bind("click", function() {
    fadeSpeed = 0;
    setTimeout(() => {
      warning.style.animation = "fadeOut 0.5s ease-in-out forwards";
    }, fadeSpeed);
    
  setTimeout(() => {
      warning.style.display = 'none';
    }, fadeSpeed + 400);
  });

  setTimeout(() => {
      warning.style.animation = "fadeOut 0.5s ease-in-out forwards";
    }, fadeSpeed);
    
  setTimeout(() => {
      warning.style.display = 'none';
    }, fadeSpeed + 400);
}


export function confirmPassword() {
  const ttsPassword = '@Rafafa2105';
  const passwordInput = document.querySelector("#ttsPassword").value;
  if (passwordInput == ttsPassword){
      enableTTS = true;
      successfulWarning("Senha correta!", "O TTS está ativado agora.");
      $(".ttsCheckbox").prop("checked", true);
      passwordModal(false);
  }else{
      enableTTS = false;
      errorWarning("Senha incorreta!", "Tente novamente.");
      $(".ttsCheckbox").prop("checked", false);
  }
}