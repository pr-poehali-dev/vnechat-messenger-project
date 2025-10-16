import json
import os
import random
import requests
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Send SMS verification code to phone number
    Args: event with httpMethod, body containing phone number
    Returns: HTTP response with success status
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    body_str = event.get('body', '{}')
    if not body_str:
        body_str = '{}'
    body_data = json.loads(body_str)
    phone = body_data.get('phone', '')
    
    if not phone:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Phone number required'}),
            'isBase64Encoded': False
        }
    
    code = str(random.randint(100000, 999999))
    
    api_key = os.environ.get('SMS_RU_API_KEY', '')
    
    if not api_key:
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'success': True,
                'demo': True,
                'code': code,
                'message': 'Demo mode: API key not configured'
            }),
            'isBase64Encoded': False
        }
    
    clean_phone = phone.replace('+', '').replace(' ', '').replace('-', '')
    
    sms_url = 'https://sms.ru/sms/send'
    params = {
        'api_id': api_key,
        'to': clean_phone,
        'msg': f'Ваш код подтверждения VneChat: {code}',
        'json': 1
    }
    
    response = requests.get(sms_url, params=params)
    result = response.json()
    
    if result.get('status') == 'OK':
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'success': True,
                'code': code
            }),
            'isBase64Encoded': False
        }
    else:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'success': False,
                'error': result.get('status_text', 'SMS sending failed')
            }),
            'isBase64Encoded': False
        }