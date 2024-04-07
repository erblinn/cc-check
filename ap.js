// Function to fill the card number into the input field
function fillCardNumber() {
    var cardNumberInput = document.getElementById("cardnumber");
    if (cardNumberInput) {
        // Create and dispatch a keyboard event
        var event = new KeyboardEvent('keypress', {
            bubbles: true, 
            cancelable: true,
            key: "4",
            code: "Digit4",
            charCode: 52
        });
        cardNumberInput.dispatchEvent(event);
        
        event = new KeyboardEvent('keypress', {
            bubbles: true, 
            cancelable: true,
            key: "1",
            code: "Digit1",
            charCode: 49
        });
        cardNumberInput.dispatchEvent(event);

        // Repeat the process for the remaining digits
        // ...

        // Optionally, trigger the input event to simulate input detection
        var inputEvent = new Event('input', {
            bubbles: true,
            cancelable: true,
        });
        cardNumberInput.dispatchEvent(inputEvent);
    } else {
        console.error("Input field with ID 'cardnumber' not found.");
    }
}

// Call the function when the page is loaded
window.onload = fillCardNumber;