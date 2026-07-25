#!/usr/bin/env python3

import urllib.request
import urllib.parse
import re
import sys
import json
import subprocess
import os

# warna
GREEN = '\033[0;32m'
RED = '\033[0;31m'
YELLOW = '\033[1;33m'
BLUE = '\033[0;34m'
WHITE = '\033[1;37m'
GRAY = '\033[0;90m'
RESET = '\033[0m'

# Load carriers dari JSON
def load_carriers():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    json_path = os.path.join(script_dir, 'data', 'carriers.json')
    try:
        with open(json_path, 'r') as f:
            return json.load(f)
    except:
        return {}

CARRIERS = load_carriers()

def format_number(number):
    clean = re.sub(r'\D', '', number)
    if clean.startswith('0'):
        return clean
    if clean.startswith('62'):
        return '0' + clean[2:]
    return clean

def detect_country(number):
    n = re.sub(r'\D', '', number)
    for code, data in CARRIERS.items():
        if n.startswith(code):
            return data
    return None

def get_carrier(number):
    n = re.sub(r'\D', '', number)
    country = detect_country(n)
    if not country:
        return 'Unknown'
    operators = country.get('operators', {})
    for op_name, prefixes in operators.items():
        for prefix in prefixes:
            if n.startswith(prefix):
                return op_name
    return 'Unknown'

def format_number_display(number):
    n = re.sub(r'\D', '', number)
    if n.startswith('62'):
        if len(n) == 11:
            return f"+62 {n[2:5]}-{n[5:9]}-{n[9:]}"
        elif len(n) == 12:
            return f"+62 {n[2:5]}-{n[5:9]}-{n[9:]}"
        elif len(n) == 13:
            return f"+62 {n[2:5]}-{n[5:9]}-{n[9:]}"
    return f"+{n}"

def check_whatsapp(number):
    n = re.sub(r'\D', '', number)
    try:
        req = urllib.request.Request(
            f'https://wa.me/{n}',
            headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'},
            method='GET'
        )
        # Coba dengan method HEAD
        response = urllib.request.urlopen(req, timeout=5)
        if response.getcode() in [200, 302]:
            return ' Active'
    except:
        pass
    return '❌ Inactive'

def check_platform(platform, number):
    url = f"https://www.hotelmurah.com/pulsa/top-up-{platform.lower()}"
    
    try:
        req = urllib.request.Request(url, headers={
            'User-Agent': 'Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36'
        })
        response = urllib.request.urlopen(req, timeout=15)
        html = response.read().decode('utf-8')
        
        csrf_match = re.search(r'name="hm_csrf_hash_name" value="([^"]+)"', html)
        csrf = csrf_match.group(1) if csrf_match else None
        
        cookie = response.headers.get('Set-Cookie', '')
        cookie = cookie.split(';')[0] if cookie else ''
        
        if not csrf:
            return '❌ Gagal'
        
        product_match = re.search(r'product_id="([^"]+)"', html)
        product_id = product_match.group(1) if product_match else "1"
        
        tipe_map = {'OVO': '10', 'DANA': '11', 'GoPay': '12'}
        tipe = tipe_map.get(platform, '10')
        
        data = urllib.parse.urlencode({
            'cust_number': number,
            'id': product_id,
            'tipe_produk': tipe,
            'web': 'web',
            'hm_csrf_hash_name': csrf
        }).encode('utf-8')
        
        req = urllib.request.Request(
            'https://www.hotelmurah.com/pulsa/index.php/ewallet/isOrderValidated',
            data=data,
            headers={
                'User-Agent': 'Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36',
                'Content-Type': 'application/x-www-form-urlencoded',
                'Cookie': cookie
            }
        )
        
        response = urllib.request.urlopen(req, timeout=15)
        result = json.loads(response.read().decode('utf-8'))
        
        status = result.get('status')
        
        if status == 1:
            return ' Terdaftar'
        elif status == 888:
            return ' Tidak Terdaftar'
        elif status == 55:
            return ' Cooldown'
        elif status == 66:
            return ' Pending'
        else:
            return f'⚠️ {status}'
            
    except Exception as e:
        return f' Error'

def main():
    if len(sys.argv) < 2:
        print(f"{RED}Usage: python main.py [nomor]{RESET}")
        sys.exit(1)
    
    raw_number = sys.argv[1]
    clean_number = re.sub(r'\D', '', raw_number)
    
    # Deteksi country & carrier
    country = detect_country(clean_number)
    carrier = get_carrier(clean_number)
    
    formatted = format_number_display(clean_number)
    local_number = format_number(clean_number)
    
    # WhatsApp
    wa_status = check_whatsapp(clean_number)
    
    # Verifikasi (SIM vs NOKOS)
    verifikasi = ' False'
    if carrier != 'Unknown':
        verifikasi = ' True'
    
    # Cek E-Wallet
    platforms = ['DANA', 'GoPay', 'OVO']
    results = {}
    
    # Tampilkan hasil
    print(f"\n{BLUE}═══════════════════════════════════════════{RESET}")
    print(f"{WHITE}  📱 OSINT NUMBER{RESET}")
    print(f"{BLUE}═══════════════════════════════════════════{RESET}")
    
    print(f"  {WHITE}Number       :{RESET} {GREEN}{formatted}{RESET}")
    print(f"  {WHITE}Raw          :{RESET} {GRAY}{clean_number}{RESET}")
    print(f"  {WHITE}Country      :{RESET} {GREEN}{country['name'] if country else 'Unknown'}{RESET}")
    print(f"  {WHITE}Country Code :{RESET} {YELLOW}{'+' + country['code'] if country else 'Unknown'}{RESET}")
    print(f"  {WHITE}Carriers     :{RESET} {YELLOW}{carrier}{RESET}")
    print(f"  {WHITE}Verifikasi   :{RESET} {verifikasi}")
    print(f"  {WHITE}WA Business  :{RESET} {wa_status}")
    
    # Cek E-Wallet
    print(f"\n{BLUE}═══════════════════════════════════════════{RESET}")
    print(f"{WHITE}   E-WALLET STATUS{RESET}")
    print(f"{BLUE}═══════════════════════════════════════════{RESET}")
    
    for platform in platforms:
        status = check_platform(platform, local_number)
        results[platform] = status
        print(f"  {WHITE}{platform:<10}{RESET}: {status}")
    
    print(f"\n{BLUE}═══════════════════════════════════════════{RESET}")
    print(f"{GRAY}  Results | Powered by OSINT-IO{RESET}")
    print(f"{BLUE}═══════════════════════════════════════════{RESET}\n")

if __name__ == "__main__":
    main()