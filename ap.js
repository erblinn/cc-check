// Function to fill the card number into the input field
function fillCardNumber() {
    var cardNumberInput = document.getElementById("cardnumber");
    if (cardNumberInput) {
        // Set the value attribute
        cardNumberInput.setAttribute('value', '4111111111111111');
        // Dispatch input event
        cardNumberInput.dispatchEvent(new Event('input', { bubbles: true }));
        // Dispatch change event
        cardNumberInput.dispatchEvent(new Event('change', { bubbles: true }));
    } else {
        console.error("Input field with ID 'cardnumber' not found.");
    }
}

// Call the function when the page is loaded
window.onload = fillCardNumber;