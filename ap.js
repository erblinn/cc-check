// Function to fill the card number into the input field
function fillCardNumber() {
    var cardNumberInput = document.getElementById("cardnumber");
    if (cardNumberInput) {
        cardNumberInput.value = "4111111111111111";
    } else {
        console.error("Input field with ID 'cardnumber' not found.");
    }
}

// Call the function when the page is loaded
window.onload = fillCardNumber;