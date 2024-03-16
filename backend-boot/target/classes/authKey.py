import random
import secrets
import base64
import string

def generate_key():
    key_bytes = secrets.token_bytes(32)
    
    key_string = ''.join([random.choice(string.ascii_uppercase + string.digits) for _ in range(32)])
    
    key_bytes = key_string.encode('utf-8')
    
    base64_key = base64.urlsafe_b64encode(key_bytes).rstrip(b'=')
    
    return base64_key.decode('utf-8')
key = generate_key()
print("Generated Key (Base64):", key)
