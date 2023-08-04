const inputField = document.getElementById("input");
const chatMessages = document.getElementById("chat-messages");
const loadingContainer = document.getElementById("loading-container");
let newMessage = null;
let userId = getCookie("userId");

// If the userId is not set, generate a new one
if (!userId) {
  userId = "website-user-" + Math.random().toString(36).substring(2, 15);
  setCookie("userId", userId);
}

inputField.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    if (event.shiftKey) {
      // Insert a line break at the current cursor position
      const cursorPosition = inputField.selectionStart;
      inputField.value =
        inputField.value.substring(0, cursorPosition) +
        "" +
        inputField.value.substring(cursorPosition);
      inputField.selectionEnd = cursorPosition + 1;
    } else {
      sendMessage();
    }
  }
});

function randomDelay(min, max) {
  return Math.random() * (max - min) + min;
}

function sendMessage() {
  // Hide the input field and show the loading spinner
  const circulo = document.querySelector(".maskedCircle");
  const loading = document.querySelector(".loading-container");

  const delay = randomDelay(500, 2000);
  circulo.style.animation = `color 0.4s linear forwards, glow 0.4s linear forwards, blink 0.3s infinite steps(1) ${delay}ms`;
  inputField.style.animation = "fadeOut 0.5s ease forwards";
  inputField.disabled = true;

  const query = inputField.value;

  const data = {
    text: query,
    key: "4ba7bc8e-5fda-4691-8427-1f5abddaae0d",
    user_id: userId,
    speak: false
  };

  fetch("https://api.carterlabs.ai/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Input:", data.input);
      console.log("Output:", data.output);

      // Create a new message element
      newMessage = document.createElement("div");
      newMessage.classList.add("message");
      newMessage.textContent = data.output.text;

      // Append the message element to the chat messages container
      chatMessages.appendChild(newMessage);

      // Scroll to the bottom of the chat messages container
      chatMessages.scrollTop = chatMessages.scrollHeight;

      // Fade in the message element
      setTimeout(() => {
        newMessage.style.display = "block";
        const messages = document.querySelectorAll(".message");
        if (messages.length > 1) {
          messages[messages.length - 2].style.opacity = 0;
          setTimeout(() => {
            messages[messages.length - 2].remove();
          }, 1000);
        }
      }, 100);

      // Hide the loading spinner and show the input field again
      // Clear the input field
      inputField.value = "";

      // Show the input field with a fade-in animation
      inputField.style.animation = "fadeIn 0.5s ease forwards";
      inputField.disabled = false;

      // Hide the loading container with a fade-out animation
      circulo.style.animation =
        "reverseColor 1s linear forwards, reverseGlow 1s linear forwards, blink 1s infinite linear";
    })
    .catch((error) => {
      console.error("Error:", error);

      // Hide the loading spinner and show the input field again
    });

  // Clear the input field
  inputField.value = "";
}

// Function to get the value of a cookie
function getCookie(name) {
  const cookies = document.cookie.split(";");
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith(name + "=")) {
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
const minWidthBlurred = 240;
const minWidthFocused = 300;
const padding = 8; // Adjust this value if you have any padding on the input element

// Function to calculate the text width based on content
function getTextWidth(text) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  context.font = window.getComputedStyle(input).getPropertyValue("font");
  const width = context.measureText(text).width;
  canvas.remove();
  return width + padding * 2; // Add padding to the calculated width
}

// Function to set the input field width
function setInputWidth() {
  const currentText = input.value;
  const textWidth = getTextWidth(currentText);
  const maxWidth = window.innerWidth * 0.8;

  // Adjust the input field width based on content
  if (input === document.activeElement) {
    // If the input field is focused, set the width to minWidthFocused
    input.style.width = `${Math.max(textWidth, minWidthFocused)}px`;
  } else {
    // If the input field is not focused, set the width to minWidthBlurred
    input.style.width = `${Math.max(textWidth, minWidthBlurred)}px`;
  }

  // If the width exceeds maxWidth, let it wrap to the next line
  if (textWidth >= maxWidth) {
    input.style.whiteSpace = "pre-wrap";
    // Limit the width of the input field to maxWidth
    input.style.width = `${maxWidth}px`;
  } else {
    input.style.whiteSpace = "nowrap";
  }
}

// Add event listeners to adjust the input field width dynamically
input.addEventListener("input", setInputWidth);
input.addEventListener("focus", setInputWidth);
input.addEventListener("blur", setInputWidth);

// Function to set the input field height
function setInputHeight() {
  const currentText = input.value;
  const textWidth = getTextWidth(currentText);
  const maxWidth = window.innerWidth * 0.8;
  const lineHeight = parseInt(
    window.getComputedStyle(input).getPropertyValue("line-height")
  );

  // Adjust the input field height based on content
  if (input === document.activeElement) {
    // If the input field is focused, set the height to lineHeight
    input.style.height = `${lineHeight}px`;
  } else {
    // If the input field is not focused, set the height to lineHeight
    input.style.height = `${lineHeight}px`;
  }

  // If the width exceeds maxWidth, increase the height to wrap to the next line
  if (textWidth >= maxWidth) {
    const lines = Math.ceil(textWidth / maxWidth);
    input.style.height = `${lines * lineHeight}px`;
  }
}

// Add event listeners to adjust the input field height dynamically
input.addEventListener("input", setInputHeight);
input.addEventListener("focus", setInputHeight);
input.addEventListener("blur", setInputHeight);

const textarea = document.querySelector("textarea");

// Function to set the textarea height
function setTextareaHeight() {
  // Reset the textarea height to auto to calculate the scroll height
  textarea.style.height = "auto";
  // Set the textarea height to its scroll height
  textarea.style.height = `${textarea.scrollHeight}px`;
}

// Add event listeners to adjust the textarea height dynamically
textarea.addEventListener("input", setTextareaHeight);
