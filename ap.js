// Function to fill the credit card information into the input fields
function fillCreditCardInfo(ccInfo) {
    var cardNumberInput = document.getElementById("cardnumber");
    var expiryMonthInput = document.getElementById("Ecom_Payment_Card_ExpDate_Month");
    var expiryYearInput = document.getElementById("Ecom_Payment_Card_ExpDate_Year");
    var cvvInput = document.getElementById("CVV2");
    
    if (cardNumberInput && expiryMonthInput && expiryYearInput && cvvInput) {
        // Split the credit card information
        var ccArray = ccInfo.split('|');
        if (ccArray.length === 4) {
            var cardNumber = ccArray[0];
            var expiryMonth = ccArray[1];
            var expiryYear = ccArray[2].length === 2 ? '20' + ccArray[2] : ccArray[2]; // Adjust the year format if necessary
            var cvv = ccArray[3];
            
            // Set values for card number, expiry month, expiry year, and CVV
            cardNumberInput.value = cardNumber;
            expiryMonthInput.value = expiryMonth;
            expiryYearInput.value = expiryYear;
            cvvInput.value = cvv;
            
            // Dispatch input and change events for each input field
            cardNumberInput.dispatchEvent(new Event('input', { bubbles: true }));
            expiryMonthInput.dispatchEvent(new Event('change', { bubbles: true }));
            expiryYearInput.dispatchEvent(new Event('change', { bubbles: true }));
            cvvInput.dispatchEvent(new Event('input', { bubbles: true }));
            
            // Log success message
            console.log("Credit card information successfully filled.");
            return true; // Indicates success
        } else {
            console.error("Invalid credit card information format.");
            return false; // Indicates failure
        }
    } else {
        console.error("One or more input fields not found.");
        return false; // Indicates failure
    }
}

// Function to delay execution by 3 seconds
function delayExecution() {
    setTimeout(function() {
        var ccInfo = "4111111111111111|12|2024|123"; // Example credit card information
        var success = fillCreditCardInfo(ccInfo);
        if (!success) {
            console.error("Failed to fill credit card information.");
        }
    }, 3000); // 3 seconds delay
}

// Call the delayExecution function when the page is loaded
window.onload = delayExecution;