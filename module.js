import { HfInference } from "https://cdn.skypack.dev/@huggingface/inference@2.6.4";
import { tts } from './index.js';
import { settingsModal } from './index.js';
import { passwordModal } from './index.js';
import { successfulWarning } from "./index.js";
import { infoWarning } from "./index.js";
import { alertWarning } from "./index.js";
import { errorWarning } from "./index.js";
import { enableTTS } from "./index.js";
import { confirmPassword } from "./index.js";


let history = '';
var formattedDate;

// export let ttsText = tts();


// A function that requests a file from the server and logs its contents
function historyReader(date) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', './definition.txt', true);

  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      var fileContent = xhr.responseText;
      history = fileContent;
    }
  };

  xhr.send();
}
window.onload = function () {
  const timeZone = 'America/Sao_Paulo'; // 'America/Sao_Paulo' corresponds to GMT-3
  const locale = 'pt-BR';

  const currentDate = new Date();
  const options = { timeZone, weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: false };

  formattedDate = new Intl.DateTimeFormat(locale, options).format(currentDate);

  historyReader(formattedDate);
}

function getRandomDuration(value1, value2) {
  // Generate a random number between 0 (inclusive) and 1 (exclusive)
  const randomValue = Math.random();

  // Check if the random number is less than 0.2
  if (randomValue < 0.2) {
    return value1;
  } else {
    return value2;
  }
}


async function* textStreamRes(hf, controller, input) {
  let tokens = [];
  for await (const output of hf.textGenerationStream(
    {
      model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
      inputs: input,
      parameters: { max_new_tokens: 1000 },
    },
    {
      use_cache: false,
      signal: controller.signal,
    }
  )) {
    tokens.push(output);
    yield tokens;
  }
}



$("#confirmPassword").bind("click", confirmPassword);





async function run(rawInput) {
  const controller = new AbortController();
  const message = "[INST]{:}[/INST]";
  const input = message.replace("{:}", rawInput);
  const token = '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';
  const hf = new HfInference(token);
  let gen = document.querySelector("#message");
  let loadingCircle = document.querySelector(".maskedCircle");
  history += input;

  gen.innerHTML = "";
  try {
    for await (const tokens of textStreamRes(hf, controller, history)) {
      const lastToken = tokens[tokens.length - 1];
      const lastTokenFormated = lastToken.token.text;
      gen.textContent += lastTokenFormated.replace("</s>", "");
      history += lastTokenFormated;

      if (lastTokenFormated == "</s>") {
        gen.innerHTML = marked.parse(gen.textContent);
        gen.style.animation = "fadeIn 0.5s ease-in-out forwards";
        

        // TTS part
        if(enableTTS){
            let text = '';
            let text2 = '';
            text = gen.textContent.replace('██████ ████', "--");
            text2 = text.replace('████', '--'); 
            tts(text2, true);
        }else{
          loadingCircle.style.animation = "reverseColor 1s linear forwards, reverseGlow 1s linear forwards, blink 1s infinite linear";
        }


      } else {
        let blinkValue = getRandomDuration(0, 1);

        loadingCircle.style.animation = `color 0.3s linear forwards, glow 0.3s linear forwards`;
        loadingCircle.style.opacity = blinkValue;


        loadingCircle.style.transition = "all 0.1s linear";
      }


    }
  } catch (e) {
    errorWarning("Um erro ocorreu!", e);
    console.log(e);
  }
}

$('#cleanHistory').bind('click', function(){
  historyReader(formattedDate);
  const messageElement = document.querySelector('#message');
  infoWarning("Chat resetado!", "O histórico dessa conversa foi limpo!");
  messageElement.style.animation = "fadeOut 0.5s ease-in-out forwards";
  setTimeout(() => {
    messageElement.innerHTML = "Olá, eu sou Stella. <br>Como posso lhe ajudar hoje?";
    messageElement.style.animation = "fadeIn 0.5s ease-in-out forwards";
  }, 525);
});



document.addEventListener("keydown", function (event) {
  const isShiftPressed = event.shiftKey;
  const isEnterPressed = event.key === "Enter";
  const passwordModalElement = document.querySelector('#ttsModalPassword');
  const settingsModalElement = document.querySelector("#settingsModal");

  if (isEnterPressed && !isShiftPressed && passwordModalElement.style.display != 'block' && settingsModalElement.style.display != 'block') {
    event.preventDefault();
    const inputElement = document.querySelector("#input");
    if (!inputElement.innerText.trim()){
        alertWarning("Input vazio!", "Insira pelo menos um caractere.");
    }else{
        const messageElement = document.querySelector("#message");
        messageElement.style.animation = "fadeOut 0.5s ease-in-out forwards";
        var inputValue = inputElement.innerText.trim();
        console.log(inputValue);


        inputElement.innerHTML = "";


        setTimeout(() => {
          run(inputValue);
        }, 500);
    }
  } else if (isEnterPressed && passwordModalElement.style.display == 'block' && settingsModalElement.style.display != 'block'){
    event.preventDefault();
    $("#confirmPassword").trigger("click");
  }

});
