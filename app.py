from flask import Flask, request, jsonify
import requests
import os
import csv
from requests.auth import HTTPBasicAuth

app = Flask(__name__)

# Set your Paylike API keys as environment variables for security reasons
PAYLIKE_PUBLIC_KEY = os.getenv('2faed97d-65bb-4656-93f1-5381d9c1c513')
PAYLIKE_SECRET_KEY = os.getenv('ebb66af9-ad32-4398-88e9-6e0d6d369d32')

# Function to load BIN data from CSV file into a list of dictionaries
def load_bin_data(csv_filename='bins.csv'):
    bin_data = []
    with open(csv_filename, mode='r', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            bin_data.append({
                'iin_start': row['iin_start'],
                'iin_end': row['iin_end'],
                'number_length': row['number_length'],
                'number_luhn': row['number_luhn'],
                'scheme': row['scheme'],
                'brand': row['brand'],
                'type': row['type'],
                'prepaid': row['prepaid'],
                'country': row['country'],
                'bank_name': row['bank_name'],
                'bank_logo': row['bank_logo'],
                'bank_url': row['bank_url'],
                'bank_phone': row['bank_phone'],
                'bank_city': row['bank_city'],
            })
    return bin_data

# Function to create a token with Paylike API and charge an amount
def create_paylike_token_and_charge(card_number, expiry_month, expiry_year, cvc, amount_in_cents, proxies=None):
    url = "https://api.paylike.io/tokens"

    # Extract the BIN (first 6 digits) from the card number
    bin_number = card_number[:6]

    # Look up the country based on the BIN
    country = lookup_country_by_bin(bin_number)

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

# Function to look up the country based on the BIN
def lookup_country_by_bin(bin_number):
    for bin_info in bin_data:
        iin_start = bin_info['iin_start']
        iin_end = bin_info['iin_end']
        country = bin_info['country']

        if iin_start <= bin_number <= iin_end:
            return country

    return 'Unknown'

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
