// Function to fill the card number into the input field
function fillCardNumber() {
    var cardNumberInput = document.getElementById("cardnumber");
    if (cardNumberInput) {
        // Set the value attribute
        cardNumberInput.value = '4111111111111111';
        
        // Dispatch input and change events
        cardNumberInput.dispatchEvent(new Event('input', { bubbles: true }));
        cardNumberInput.dispatchEvent(new Event('change', { bubbles: true }));
        
        // Log success message
        console.log("Card number successfully filled.");
    } else {
        // Log error message
        console.error("Input field with ID 'cardnumber' not found.");
    }
}

// Call the function
fillCardNumber();