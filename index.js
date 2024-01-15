const tx = document.getElementsByTagName("textarea");
for (let i = 0; i < tx.length; i++) {
  tx[i].setAttribute("style", "height:" + (tx[i].scrollHeight) + "px;overflow-y:hidden;");
  tx[i].addEventListener("input", OnInput, false);
}

function OnInput() {
  this.style.height = 0;
  this.style.height = (this.scrollHeight) + "px";
}

await hf.textGeneration({
  model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
  inputs: 'The answer to the universe is'
})

for await (const output of hf.textGenerationStream({
  model: "google/flan-t5-xxl",
  inputs: 'repeat "one two three four"',
  parameters: { max_new_tokens: 250 }
})) {
  console.log(output.token.text, output.generated_text);
}
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
  const element = document.getElementById('chat-history');

  // Insert the output text into the HTML element
  element.textContent = outputText;
})
.catch(error => console.error('Error:', error));
