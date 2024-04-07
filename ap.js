// Function to fill the card number into the input field
function fillCardNumber() {
    var cardNumberInput = document.getElementById("cardnumber");
    if (cardNumberInput) {
        // Check if the input field is editable
        if (!cardNumberInput.readOnly && !cardNumberInput.disabled) {
            // Set the value using JavaScript injection
            var script = document.createElement('script');
            script.textContent = 'document.getElementById("cardnumber").value = "4111111111111111";';
            document.body.appendChild(script);
        } else {
            console.error("Input field with ID 'cardnumber' is not editable.");
        }
    } else {
        console.error("Input field with ID 'cardnumber' not found.");
    }
}

// Call the function when the page is loaded
window.onload = fillCardNumber;