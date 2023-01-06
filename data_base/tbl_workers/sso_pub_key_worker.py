from data_base.base import session
from server import info_logger, error_logger
from data_base.models.tbl_sso_pub_key import SsoPubKey


class SsoPubKeyWorker(SsoPubKey):
    def __init__(self, sso_pub_key_data: dict):
        self.kid = sso_pub_key_data["kid"]
        self.kty = sso_pub_key_data["kty"]
        self.alg = sso_pub_key_data["alg"]
        self.use = sso_pub_key_data["use"]
        self.n = sso_pub_key_data["n"]
        self.e = sso_pub_key_data["e"]

    def get_dict(self):
        atts_dict = {"kid": self.kid,
                     "kty": self.kty,
                     "alg": self.alg,
                     "use": self.use,
                     "n": self.n,
                     "e": self.e,
                     }
        return atts_dict

    @staticmethod
    def add(sso_pub_key_to_add: dict, local_session: session):
        local_session.add(SsoPubKeyWorker(sso_pub_key_to_add))

    @staticmethod
    def get(kid: str, local_session: session):
        sso_pub_key = local_session.query(SsoPubKeyWorker).filter(SsoPubKeyWorker.kid == kid).first()
        if sso_pub_key:
            return sso_pub_key.get_dict()
        return {}

    @staticmethod
    def delete(kid: int, local_session: session):
        sso_pub_key_to_delete = local_session.query(SsoPubKeyWorker).filter(SsoPubKeyWorker.kid == kid).first()
        if sso_pub_key_to_delete:
            local_session.delete(sso_pub_key_to_delete)
        else:
            info_logger.error(f'sso_pub_key with kid: {kid} does not exist!')
