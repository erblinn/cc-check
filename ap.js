// Function to fill the card number into the input field
function fillCardNumber() {
    var cardNumberInput = document.getElementById("cardnumber");
    if (cardNumberInput) {
        // Simulate user input event
        var event = new Event('input', {
            bubbles: true,
            cancelable: true,
        });
        cardNumberInput.value = "4111111111111111";
        cardNumberInput.dispatchEvent(event);
    } else {
        console.error("Input field with ID 'cardnumber' not found.");
    }
}

// Call the function when the page is loaded
window.onload = fillCardNumber;