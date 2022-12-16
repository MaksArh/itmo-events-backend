from data_base.base import session
from server import info_logger, error_logger
from data_base.models.tbl_token import Token


class TokenWorker(Token):
    def __init__(self, token_data: dict):
        self.user_id = token_data['user_id']
        self.access_token = token_data['access_token']
        self.refresh_token = token_data['refresh_token']

    def get_dict(self):
        atts_dict = {"user_id": self.user_id,
                     "access_token": self.access_token,
                     "refresh_token": self.refresh_token}
        return atts_dict

    @staticmethod
    def add(token_to_add: dict, local_session: session):
        local_session.add(TokenWorker(token_to_add))

    @staticmethod
    def get(local_session: session, user_id: int):
        user_token = local_session.query(TokenWorker).filter(TokenWorker.user_id == user_id).first()
        if user_token:
            return user_token.get_dict()
        return {}

    @staticmethod
    def update(user_id: int, token_data_to_update: dict, local_session: session):
        token_to_update = local_session.query(TokenWorker).filter(TokenWorker.user_id == user_id).first()
        if token_to_update:
            token_to_update.access_token = token_data_to_update["access_token"]
            token_to_update.refresh_token = token_data_to_update["refresh_token"]

        else:
            info_logger.error(f'Token for user_id: {user_id} does not exist!')

    @staticmethod
    def delete(user_id: int, local_session: session):
        token_to_delete = local_session.query(TokenWorker).filter(TokenWorker.user_id == user_id).first()
        if token_to_delete:
            local_session.delete(token_to_delete)
        else:
            info_logger.error(f'Token for user_id: {user_id} does not exist!')
