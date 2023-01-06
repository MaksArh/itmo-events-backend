import jwt
from jose import jwk
from jose.utils import base64url_decode
import json
import binascii


from server.services.sso.env_params import client_id


def get_key(header):
    # берём хэдер, расшифровываем и смотрим есть ли в бд открытый ключ
    try:
        decoded_header_bytes = base64url_decode(header + '=' * (4 - len(header) % 4))
    except binascii.Error:
        return {'status': 'Invalid token'}

    try:
        decoded_header = json.loads(decoded_header_bytes.decode('utf-8'))
    except UnicodeDecodeError:
        return {'status': 'Invalid token'}

    kid = decoded_header['kid']

    # # get from db
    # if len(ItmoidRsaKeys.objects.filter(kid=kid)) == 0:
    #     return {'status': 'ok', 'rsa_key': ItmoId.get_pub_keys()}

    # db_key = ItmoidRsaKeys.objects.get(kid=kid)
    #
    # rsa_key = {
    #     "kid": db_key.kid,
    #     "kty": db_key.kty,
    #     "alg": db_key.alg,
    #     "use": db_key.use,
    #     "n": db_key.n,
    #     "e": db_key.e
    # }
    #
    # return {'status': 'ok', 'rsa_key': rsa_key}


def verify(access_token: str):
    # расшифровать первую чаcть токена, сверить kid и затем осуществить проверку JWS с данным ключем (kid) если все
    # успешно отдать ок и пэйлоад

    if access_token.count('.') != 2:
        return {"status": "Invalid token"}

    message, encoded_sig = access_token.rsplit('.', 1)
    encoded_header = access_token.split('.', 1)[0]

    get_key_result = get_key(encoded_header)
    if get_key_result['status'] == 'false':
        return {"status": "Server does not have this token key id (kid) in the cache"}
    elif get_key_result['status'] == 'Invalid token':
        return {'status': 'Invalid token'}
    else:
        rsa_key = get_key_result['rsa_key']
        key = jwk.construct(rsa_key)

    decoded_sig = base64url_decode(encoded_sig + '=' * (4 - len(encoded_sig) % 4))
    res = key.verify(bytes(message, "UTF-8"), decoded_sig)
    if res:
        try:
            payload = jwt.decode(jwt=access_token, key=key.to_pem().decode(), algorithms='RS256', audience=client_id)  # with PEM key
            return {"status": "ok", "payload": payload}

        except jwt.exceptions.ExpiredSignatureError:
            return {"status": "Signature has expired"}
        except:
            return {"status": "Something goes wrong with verifying itmo id JWT in jwt_verify.py"}
    else:
        return {"status": "Not verified"}


