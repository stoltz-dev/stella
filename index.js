const tx = document.getElementsByTagName("textarea");
for (let i = 0; i < tx.length; i++) {
  tx[i].setAttribute("style", "height:" + (tx[i].scrollHeight) + "px;overflow-y:hidden;");
  tx[i].addEventListener("input", OnInput, false);
}

function OnInput() {
  this.style.height = 0;
  this.style.height = (this.scrollHeight) + "px";
}

const axios = require("axios");

const huggingface_api_key = process.env.HUGGINGFACE_KEY; // Acessa o segredo como uma variável de ambiente
axios.get(`https://api.example.com?key=${huggingface_api_key}`) // Usa o segredo em uma requisição

// Define the API URL
const url = 'https://api-inference.huggingface.co/models/Mixtral-8x7b';

// Define the headers
const headers = {
  'Authorization': `Bearer ${huggingface_api_key}`,
  'Content-Type': 'application/json'
};

// Define the payload
const payload = {
  inputs: "<s> [INST] Escreva um poema sobre o amor [/INST]"
};

// Make the POST request
fetch(url, {
  method: 'POST',
  headers: headers,
  body: JSON.stringify(payload)
})
.then(response => response.json())
.then(data => {
  // Get the output text from the data
  const outputText = data.generated_text;

  // Get the HTML element by its ID
  const element = document.getElementById('YOUR_ELEMENT_ID');

  // Insert the output text into the HTML element
  element.textContent = outputText;
})
.catch(error => console.error('Error:', error));
