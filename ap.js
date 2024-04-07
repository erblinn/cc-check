// Create a script element
var fakerScript = document.createElement('script');

// Set the source to the Faker.js CDN
fakerScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/Faker/3.1.0/faker.min.js';

// Append the script element to the document's head
document.head.appendChild(fakerScript);

// Define function to simulate click event
function simulateClick(element) {
    var clickEvent = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window
    });
    element.dispatchEvent(clickEvent);
}

// Once Faker.js is loaded, you can use it in your code
fakerScript.onload = function() {
    // Function to fill the credit card information into the input fields
    function fillCreditCardInfo(ccInfo) {
        var cardNumberInput = document.getElementById("cardnumber");
        var expiryMonthInput = document.getElementById("date");
        var cvvInput = document.getElementById("CVV2");
        var cardHolderNameInput = document.getElementById("carholder-name");

        if (cardNumberInput && expiryMonthInput && cvvInput && cardHolderNameInput) {
            var ccArray = ccInfo.split('|');
            if (ccArray.length === 4) {
                var cardNumber = ccArray[0];
                var expiryMonth = ccArray[1];
                var expiryYear = ccArray[2].length === 4 ? ccArray[2].slice(-2) : ccArray[2];
                var cvv = ccArray[3];

                cardNumberInput.value = cardNumber;
                expiryMonthInput.value = expiryMonth + '/' + expiryYear;
                cvvInput.value = cvv;

                // Generate fake card holder name and set it as value
                var fakeCardHolderName = faker.name.findName(); // Generates a random full name
                cardHolderNameInput.value = fakeCardHolderName;

                // Dispatch input and change events for each input field
                cardNumberInput.dispatchEvent(new Event('input', { bubbles: true }));
                expiryMonthInput.dispatchEvent(new Event('input', { bubbles: true }));
                cvvInput.dispatchEvent(new Event('input', { bubbles: true }));
                cardHolderNameInput.dispatchEvent(new Event('input', { bubbles: true }));

                console.log("Credit card information successfully filled.");
            } else {
                console.error("Invalid credit card information format.");
            }
        } else {
            console.error("One or more input fields not found.");
        }
    }

    // Call the fillCreditCardInfo function with your credit card information
    var ccInfo = "4111111111111111|12|2024|123"; // Example credit card information
    fillCreditCardInfo(ccInfo);

    // Get the "Vazhdo" button element
    var vazhdoButton = document.querySelector('.btn-finish');

    // Simulate a click on the "Vazhdo" button
    simulateClick(vazhdoButton);

    // Delay for a short period to ensure the "Vazhdo" button action completes before clicking "Përfundo"
    setTimeout(function() {
        // Get the "Përfundo" button element
        var perfundoButton = document.querySelector('.btn-finish[href="javascript:onSubmit()"]');

        // Check if the "Përfundo" button element exists
        if (perfundoButton) {
            // Simulate a click on the "Përfundo" button
            simulateClick(perfundoButton);
        } else {
            console.error("Përfundo button not found.");
        }
    }, 1000); // Adjust the delay as needed
};