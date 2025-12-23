from flask import Flask, request, jsonify
import requests
from urllib.parse import urlparse, parse_qs, unquote
from bs4 import BeautifulSoup
import re
import json
app = Flask(__name__)

@app.route('/yape', methods=['GET'])
def consultar_informacion_yape():
    try:
        # Obtén el número de teléfono de los parámetros de la solicitud
        phone_number = request.args.get('numero')

        # Asegúrate de que se proporciona el número de teléfono
        if not phone_number:
            return jsonify({'error': 'Se requiere el parámetro "numero"'}), 400

        # Construye la solicitud a la API externa
        url = "https://api-prod.agora.pe/agora-private/p2p/interoperability/receiver-data"
        headers = {
            "Content-Type": "application/json",
            "X-Feature": "SALESFORCE",
            "X-Platform": "IOS",
            "Accept": "*/*",
            "X-Application": "CUS",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "es-ES;q=1.0",
            "X-Device-Uuid": "3A94769E-B71E-4AA8-80F8-7C7C81064C8A",
            "User-Agent": "tunki-user/3.0.10 (pe.indigital.tunki.user; build:1001; iOS 16.6.0) Alamofire/5.8.0",
            "X-Device-Id": "3A94769E-B71E-4AA8-80F8-7C7C81064C8A",
            "X-Device-Ip": "190.235.110.222",
            "X-App-Version": "3.0.10",
            "Client_id": "6091f39f-c6a0-3f48-8f37-7f9aca782e95",
            "Access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ4LWRldmljZS1pZCI6IjNBOTQ3NjlFLUI3MUUtNEFBOC04MEY4LTdDN0M4MTA2NEM4QSIsInN1YiI6InN1YmplY3Qtc3ViamVjdCIsImRlZXBsaW5rIjoiYWdvcmEuY29tOi8vdXNlci93YWxsZXQvb25ib2FyZGluZy9jcmVhdGUiLCJpc3MiOiJ1cm46Ly9hcGlnZWUtZWRnZS1KV1QtcG9saWN5LXRlc3QiLCJ1c2VySWQiOiIxZmE5MzBkNi02MzBkLTRiYzUtOTRkNi1hNjQ2ZjE0OTg1ZDYiLCJhdWQiOlsiYXVkaWVuY2UxIiwiYXVkaWVuY2UyIl0sIngtYXBwbGljYXRpb24iOiJDVVMiLCJmaXJlYmFzZVRva2VuIjoiZXlKaGJHY2lPaUpTVXpJMU5pSjkuZXlKaGRXUWlPaUpvZEhSd2N6b3ZMMmxrWlc1MGFYUjVkRzl2Ykd0cGRDNW5iMjluYkdWaGNHbHpMbU52YlM5bmIyOW5iR1V1YVdSbGJuUnBkSGt1YVdSbGJuUnBkSGwwYjI5c2EybDBMbll4TGtsa1pXNTBhWFI1Vkc5dmJHdHBkQ0lzSW1Oc1lXbHRjeUk2ZXlKcFpDSTZJakZtWVRrek1HUTJMVFl6TUdRdE5HSmpOUzA1TkdRMkxXRTJORFptTVRRNU9EVmtOaUlzSW5SNWNHVWlPaUpHU1ZKRlFrRlRSU0lzSW5KdmJHVkRiMlJsSWpvaVExVlRYMVZUVWlJc0ltRndjR3hwWTJGMGFXOXVJam9pUTFWVElpd2ljR3hoZEdadmNtMGlPaUpKVDFNaUxDSmtaWFpwWTJWSlpDSTZJak5CT1RRM05qbEZMVUkzTVVVdE5FRkJPQzA0TUVZNExUZEROME00TVRBMk5FTTRRU0lzSW1kbGJtVnlZWFJsVkc5clpXNGlPblJ5ZFdWOUxDSmxlSEFpT2pFM01EWXlPRGd3T1RRc0ltbGhkQ0k2TVRjd05qSTRORFE1TkN3aWFYTnpJam9pWm1seVpXSmhjMlV0WVdSdGFXNXpaR3N0Ym05bWJtZEFjR1V0WjNKMWNHOHRhVzUwWlhKamIzSndMV05zWkMwd01EUXVhV0Z0TG1kelpYSjJhV05sWVdOamIzVnVkQzVqYjIwaUxDSnpkV0lpT2lKbWFYSmxZbUZ6WlMxaFpHMXBibk5rYXkxdWIyWnVaMEJ3WlMxbmNuVndieTFwYm5SbGNtTnZjbkF0WTJ4a0xUQXdOQzVwWVcwdVozTmxjblpwWTJWaFkyTnZkVzUwTG1OdmJTSXNJblZwWkNJNklqRm1ZVGt6TUdRMkxUWXpNR1F0TkdKak5TMDVOR1EyTFdFMk5EWm1NVFE1T0RWa05pSjkuSWxHbFNIMFZYUVQ0c0F1b0JMRjBKRzJ1SWdGT0Myckd2aEN2bHRtci0xeW4xWUZjQU95WHpyODRWX2lhSS1VRnYybjRralgxeG16VFU4bG5iSkY5T0lNemZyZjdiS2gxWS10cUd1b28tQ3ZVaV84Y3VxcmV2bEc0NTMycXI5WUYyQm1QdXFVQVBfbzZjT0ExOTF0VVFzUUtOcFRld3lobGxwNUZRZ0FqcEJrckk0U2FFMDdXYjRRMVQzbzl6Q1dPODNlb19FVmd4Zi1vVFZkYkZiRWJLeFBmQzJNMXR2d1VpNENMa3dWZHRWMzhndGZDUnh2UDUxMEE5UGd2QkhBbHhuT2t1ajVoNFRjdm43NTdiemVhV0R0alNUREVHcU1yN1l4RTNLNWhxQTRMRlMyLVV2THpaUUE5cEJrbHJwSmJQZFdoUHdRYXhReV9EQlF3dVNOdWVBIiwicm9sZUNvZGUiOiJDVVNfVVNSIiwieC1wbGF0Zm9ybSI6IklPUyIsImV4cCI6MTcwODg3NjQ5NCwiaWF0IjoxNzA2Mjg0NDk0LCJmbG93IjoiTE9HSU4iLCJqdGkiOiI2M2I4ZDBjOC0yOWVmLTRmN2YtOTMxNi1mMTEwNjNhZWU5NDIifQ.h2bX8SftBp0A5hyAk4bc6GMSb-rfztpQ6LPsATFrQyU"
        }
        data = {
            "walletCode": "901",
            "phoneNumber": phone_number
            
        }

        # Convierte el diccionario 'data' a una cadena JSON
        json_data = json.dumps(data)

        # Realiza la solicitud POST a la API externa
        response = requests.post(url, headers=headers, data=json_data)

        if response.status_code == 200:
           response_data = response.json()
           receiver_name = response_data.get('receiverName', 'No disponible')
           return jsonify({'NOMBRES': receiver_name})
        else:
            print(response.text)
            # Retorna un mensaje de error si la solicitud no fue exitosa
            return jsonify({'error': f'Código de estado no exitoso: {response.status_code}'}), response.status_code

    except Exception as e:
        return jsonify({'error': f'Error en la solicitud: {str(e)}'}), 500
@app.route('/plin', methods=['GET'])
def consultar_informacion_plin():
    try:
        # Obtén el número de teléfono de los parámetros de la solicitud
        phone_number = request.args.get('numero')

        # Asegúrate de que se proporciona el número de teléfono
        if not phone_number:
            return jsonify({'error': 'Se requiere el parámetro "numero"'}), 400

        # Construye la solicitud a la API externa
        url = "https://api-prod.agora.pe/agora-private/p2p/interoperability/receiver-data"
        headers = {
            "Content-Type": "application/json",
            "X-Feature": "SALESFORCE",
            "X-Platform": "IOS",
            "Accept": "*/*",
            "X-Application": "CUS",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "es-ES;q=1.0",
            "X-Device-Uuid": "3A94769E-B71E-4AA8-80F8-7C7C81064C8A",
            "User-Agent": "tunki-user/3.0.10 (pe.indigital.tunki.user; build:1001; iOS 16.6.0) Alamofire/5.8.0",
            "X-Device-Id": "3A94769E-B71E-4AA8-80F8-7C7C81064C8A",
            "X-Device-Ip": "190.235.110.222",
            "X-App-Version": "3.0.10",
            "Client_id": "6091f39f-c6a0-3f48-8f37-7f9aca782e95",
            "Access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ4LWRldmljZS1pZCI6IjNBOTQ3NjlFLUI3MUUtNEFBOC04MEY4LTdDN0M4MTA2NEM4QSIsInN1YiI6InN1YmplY3Qtc3ViamVjdCIsImRlZXBsaW5rIjoiYWdvcmEuY29tOi8vdXNlci93YWxsZXQvb25ib2FyZGluZy9jcmVhdGUiLCJpc3MiOiJ1cm46Ly9hcGlnZWUtZWRnZS1KV1QtcG9saWN5LXRlc3QiLCJ1c2VySWQiOiIxZmE5MzBkNi02MzBkLTRiYzUtOTRkNi1hNjQ2ZjE0OTg1ZDYiLCJhdWQiOlsiYXVkaWVuY2UxIiwiYXVkaWVuY2UyIl0sIngtYXBwbGljYXRpb24iOiJDVVMiLCJmaXJlYmFzZVRva2VuIjoiZXlKaGJHY2lPaUpTVXpJMU5pSjkuZXlKaGRXUWlPaUpvZEhSd2N6b3ZMMmxrWlc1MGFYUjVkRzl2Ykd0cGRDNW5iMjluYkdWaGNHbHpMbU52YlM5bmIyOW5iR1V1YVdSbGJuUnBkSGt1YVdSbGJuUnBkSGwwYjI5c2EybDBMbll4TGtsa1pXNTBhWFI1Vkc5dmJHdHBkQ0lzSW1Oc1lXbHRjeUk2ZXlKcFpDSTZJakZtWVRrek1HUTJMVFl6TUdRdE5HSmpOUzA1TkdRMkxXRTJORFptTVRRNU9EVmtOaUlzSW5SNWNHVWlPaUpHU1ZKRlFrRlRSU0lzSW5KdmJHVkRiMlJsSWpvaVExVlRYMVZUVWlJc0ltRndjR3hwWTJGMGFXOXVJam9pUTFWVElpd2ljR3hoZEdadmNtMGlPaUpKVDFNaUxDSmtaWFpwWTJWSlpDSTZJak5CT1RRM05qbEZMVUkzTVVVdE5FRkJPQzA0TUVZNExUZEROME00TVRBMk5FTTRRU0lzSW1kbGJtVnlZWFJsVkc5clpXNGlPblJ5ZFdWOUxDSmxlSEFpT2pFM01EWXlPRGd3T1RRc0ltbGhkQ0k2TVRjd05qSTRORFE1TkN3aWFYTnpJam9pWm1seVpXSmhjMlV0WVdSdGFXNXpaR3N0Ym05bWJtZEFjR1V0WjNKMWNHOHRhVzUwWlhKamIzSndMV05zWkMwd01EUXVhV0Z0TG1kelpYSjJhV05sWVdOamIzVnVkQzVqYjIwaUxDSnpkV0lpT2lKbWFYSmxZbUZ6WlMxaFpHMXBibk5rYXkxdWIyWnVaMEJ3WlMxbmNuVndieTFwYm5SbGNtTnZjbkF0WTJ4a0xUQXdOQzVwWVcwdVozTmxjblpwWTJWaFkyTnZkVzUwTG1OdmJTSXNJblZwWkNJNklqRm1ZVGt6TUdRMkxUWXpNR1F0TkdKak5TMDVOR1EyTFdFMk5EWm1NVFE1T0RWa05pSjkuSWxHbFNIMFZYUVQ0c0F1b0JMRjBKRzJ1SWdGT0Myckd2aEN2bHRtci0xeW4xWUZjQU95WHpyODRWX2lhSS1VRnYybjRralgxeG16VFU4bG5iSkY5T0lNemZyZjdiS2gxWS10cUd1b28tQ3ZVaV84Y3VxcmV2bEc0NTMycXI5WUYyQm1QdXFVQVBfbzZjT0ExOTF0VVFzUUtOcFRld3lobGxwNUZRZ0FqcEJrckk0U2FFMDdXYjRRMVQzbzl6Q1dPODNlb19FVmd4Zi1vVFZkYkZiRWJLeFBmQzJNMXR2d1VpNENMa3dWZHRWMzhndGZDUnh2UDUxMEE5UGd2QkhBbHhuT2t1ajVoNFRjdm43NTdiemVhV0R0alNUREVHcU1yN1l4RTNLNWhxQTRMRlMyLVV2THpaUUE5cEJrbHJwSmJQZFdoUHdRYXhReV9EQlF3dVNOdWVBIiwicm9sZUNvZGUiOiJDVVNfVVNSIiwieC1wbGF0Zm9ybSI6IklPUyIsImV4cCI6MTcwODg3NjQ5NCwiaWF0IjoxNzA2Mjg0NDk0LCJmbG93IjoiTE9HSU4iLCJqdGkiOiI2M2I4ZDBjOC0yOWVmLTRmN2YtOTMxNi1mMTEwNjNhZWU5NDIifQ.h2bX8SftBp0A5hyAk4bc6GMSb-rfztpQ6LPsATFrQyU"
        }
        data = {
            "walletCode": "902",
            "phoneNumber": phone_number
            
        }


        # Convierte el diccionario 'data' a una cadena JSON
        json_data = json.dumps(data)

        # Realiza la solicitud POST a la API externa
        response = requests.post(url, headers=headers, data=json_data)

        # Retorna la respuesta del servidor externo como JSON
        if response.status_code == 200:
           response_data = response.json()
           receiver_name = response_data.get('receiverName', 'No disponible')
           return jsonify({'NOMBRES': receiver_name})
        else:
            # Retorna un mensaje de error si la solicitud no fue exitosa
            return jsonify({'error': f'Código de estado no exitoso: {response.status_code}'}), response.status_code

    except Exception as e:
        return jsonify({'error': f'Error en la solicitud: {str(e)}'}), 500    
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8088, debug=True)


