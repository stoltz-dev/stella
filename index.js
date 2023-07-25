const inputField = document.getElementById('input');
const chatMessages = document.getElementById('chat-messages');
const submitButton = document.getElementById('submit');
const loadingContainer = document.getElementById('loading-container');
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

// Event listener for the submit button click
submitButton.addEventListener('click', () => {
    sendMessage();
});

function sendMessage() {
    // Hide the input field and show the loading spinner with a fade-in effect
    inputField.style.display = 'none';
    loadingContainer.style.display = 'block';
    loadingContainer.style.animation = 'fadeInOut 2s ease-in-out';

    const query = inputField.value;

    const data = {
        text: query,
        key: '4ba7bc8e-5fda-4691-8427-1f5abddaae0d',
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

            // Hide the loading spinner with a fade-out effect
            setTimeout(() => {
                loadingContainer.style.display = 'none';
                loadingContainer.style.animation = '';
            }, 2000);

            // Show the input field again
            inputField.style.display = 'block';
        })
        .catch(error => {
            console.error('Error:', error);

            // Hide the loading spinner with a fade-out effect
            setTimeout(() => {
                loadingContainer.style.display = 'none';
                loadingContainer.style.animation = '';
            }, 2000);

            // Show the input field again
            inputField.style.display = 'block';
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

const input = document.querySelector("#input");
const submitButton = document.querySelector("#submit");
const inputContainer = document.querySelector(".input-container");

input.addEventListener("focus", () => {
    input.style.transition = "width 0.5s, height 0.5s";
    input.style.width = "80%";
});

input.addEventListener("blur", () => {
    input.style.transition = "width 0.5s, height 0.5s";
    input.style.width = "240px"; // Back to the original width
});

input.addEventListener("input", () => {
    const inputWidth = input.value.length * 10 + 240;
    const maxWidth = Math.min(window.innerWidth * 0.8, 500);
    const width = Math.min(inputWidth, maxWidth);

    if (inputWidth <= maxWidth) {
        // When inputWidth is less than or equal to maxWidth, only adjust the width
        input.style.width = `${width}px`;
        input.style.height = '32px';
    } else {
        // When inputWidth exceeds maxWidth, adjust both width and height
        input.style.width = `${maxWidth}px`;
        input.style.height = `${input.scrollHeight}px`;
    }
});

// Function to get the input container's right position relative to the viewport
function getInputContainerRight() {
    const inputContainerRect = inputContainer.getBoundingClientRect();
    return inputContainerRect.left + inputContainerRect.width;
}

// Event listener to update submit button position
window.addEventListener("resize", () => {
    const inputContainerRight = getInputContainerRight();
    const submitButtonRight = submitButton.getBoundingClientRect().right;

    // If the submit button is going off-screen, adjust its position
    if (submitButtonRight > window.innerWidth) {
        submitButton.style.left = `${window.innerWidth - submitButtonRight + 10}px`;
    }

    // If the input container is going off-screen, adjust its position
    if (inputContainerRight > window.innerWidth) {
        inputContainer.style.right = `${window.innerWidth - inputContainerRight}px`;
    }
});
