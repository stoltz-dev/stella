window.onload = function(){
    chat_message = document.getElementById("message");
    chat_message.innerHTML = marked.parse(chat_message.textContent);
}
