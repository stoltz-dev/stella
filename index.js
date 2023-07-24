const inputField = document.getElementById('input');
const chatMessages = document.getElementById('chat-messages');
const submitButton = document.getElementById('submit');
let newMessage = null;
let userId = getCookie('userId');

// If the userId is not set, generate a new one
if (!userId) {
  userId = 'website-user-' + Math.random().toString(36).substring(2, 15);
  setCookie('userId', userId);
}

inputField.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    sendMessage();
  }
});

function sendMessage() {
  const query = inputField.value;

  const data = {
    text: query,
    key: '931605b9-87c1-45af-b9b8-b59b8f5ad17a',
    user_id: userId,
    speak: false
  };

  fetch('https://api.carterlabs.ai/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then(response => response.json())
    .then(data => {
      console.log('Input:', data.input);
      console.log('Output:', data.output);

      // Create a new message element
      newMessage = document.createElement('div');
      newMessage.classList.add('message');
      newMessage.textContent = data.output.text;

      // Append the message element to the chat messages container
      chatMessages.appendChild(newMessage);

      // Scroll to the bottom of the chat messages container
      chatMessages.scrollTop = chatMessages.scrollHeight;

      // Fade in the message element
      setTimeout(() => {
        newMessage.style.display = 'block';
        const messages = document.querySelectorAll('.message');
        if (messages.length > 1) {
          messages[messages.length - 2].style.opacity = 0;
          setTimeout(() => {
            messages[messages.length - 2].remove();
          }, 1000);
        }
      }, 100);
    })
    .catch(error => {
      console.error('Error:', error);
    });

  // Clear the input field
  inputField.value = '';
}

// Function to get the value of a cookie
function getCookie(name) {
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith(name + '=')) {
      return cookie.substring(name.length + 1);
    }
  }
  return null;
}

// Function to set the value of a session cookie
function setCookie(name, value) {
  document.cookie = name + "=" + value + "; path=/";
}
