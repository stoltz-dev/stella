const tx = document.getElementsByTagName("textarea");
for (let i = 0; i < tx.length; i++) {
  tx[i].setAttribute("style", "height:" + (tx[i].scrollHeight) + "px;overflow-y:hidden;");
  tx[i].addEventListener("input", OnInput, false);
}

function OnInput() {
  this.style.height = 0;
  this.style.height = (this.scrollHeight) + "px";
}


// Carrega o modelo e o tokenizador
const model = AutoModelForCausalLM.fromPretrained("mistralai/Mixtral-8x7B-v0.1");
const tokenizer = AutoTokenizer.fromPretrained("mistralai/Mixtral-8x7B-v0.1");

// Define o texto de entrada com a instrução
const input = "<s> [INST] Escreva um poema sobre o amor [/INST]";

// Codifica o texto de entrada
const encodedInput = tokenizer.encode(input, { return_tensors: "tf" });

// Gera o texto de saída
const output = model.generate(encodedInput, { max_length: 250 });

// Decodifica o texto de saída
const decodedOutput = tokenizer.decode(output[0], { skipSpecialTokens: true });

// Mostra o texto de saída no elemento
document.getElementById("chat-messages").innerHTML = decodedOutput;
