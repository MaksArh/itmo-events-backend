from datetime import datetime, timedelta
from sqlalchemy import select, insert, and_, update, delete

from data_base.base import get_session
from server import info_logger, error_logger
from data_base.models.tbl_user import User
from data_base.tbl_workers.event_worker import EventWorker

from configurations import config


class UserWorker(User):

    def __repr__(self):
        return f"<User(User_name: {self.user_name}, User_surname: {self.user_surname})>"

    def get_dict(self):
        atts_dict = {"user_isu_number": self.user_isu_number,
                     "user_name": self.user_name,
                     "user_surname": self.user_surname,
                     "user_patronymic": self.user_patronymic,
                     "phone": self.phone,
                     "vk_link": self.vk_link,
                     "mail": self.mail,
                     "is_russian_citizenship": self.is_russian_citizenship,
                     "score": self.score,
                     "notify_id": self.notify_id,
                     "ban_date": self.ban_date,
                     "time_select_finish": self.time_select_finish}
        return atts_dict

    @staticmethod
    async def add(user_to_add: dict, local_session: get_session):
        query = insert(User).values(user_to_add)
        await local_session.execute(query)

    @staticmethod
    async def get(user_isu_number: int, local_session: get_session):
        query = select(User).where(User.user_isu_number == int(user_isu_number)).limit(1)
        user = await local_session.execute(query)
        user = user.scalars().first()

        if user:
            return UserWorker.get_dict(user)
        else:
            return {}

    @staticmethod
    async def update(user_isu_number: int, user_data_to_update: dict, local_session: get_session):
        query = update(User).where(User.user_isu_number == int(user_isu_number)).values(user_data_to_update)
        await local_session.execute(query)


    @staticmethod
    async def delete(user_isu_number: int, local_session: get_session):
        query = delete(User).where(User.user_isu_number == int(user_isu_number))
        await local_session.execute(query)

    @staticmethod
    async def update_add_notify(user_isu_number: int, notify_id: int, local_session: get_session):
        user_data_to_update = {"time_select_finish": datetime.now() + timedelta(config.TIME_TO_ACCEPT),
                               "notify_id": User.notify_id + notify_id}
        query = update(User).where(User.user_isu_number == int(user_isu_number)).values(user_data_to_update)

        await local_session.execute(query)

    @staticmethod
    async def update_del_notify(user_isu_number: int, notify_id: int, local_session: get_session):
        user_data_to_update = {"notify_id": User.notify_id.remove(notify_id)}
        query = update(User).where(User.user_isu_number == int(user_isu_number)).values(user_data_to_update)

        await local_session.execute(query)

    @staticmethod
    async def update_ban_date(user_isu_number: int, ban_date: datetime, local_session: get_session):
        user_data_to_update = {"ban_date": ban_date}
        query = update(User).where(User.user_isu_number == int(user_isu_number)).values(user_data_to_update)

        await local_session.execute(query)

    @staticmethod
    async def update_add_score(user_isu_number: int, score: int, local_session):
        user_data_to_update = {"score": score}
        query = update(User).where(User.user_isu_number == int(user_isu_number)).values(user_data_to_update)

        await local_session.execute(query)

    @staticmethod
    async def update_del_timer(user_isu_number: int, local_session: get_session):
        user_data_to_update = {"time_select_finish": None}
        query = update(User).where(User.user_isu_number == int(user_isu_number)).values(user_data_to_update)

        await local_session.execute(query)

    @staticmethod
    async def apply_event(user_id: int, event_id: int, local_session: get_session):
        await EventWorker.update_add_users_id_go(event_id, user_id, local_session)
        await EventWorker.update_del_users_id_want(event_id, user_id, local_session)

        event_ = await EventWorker.get(event_id)
        coeff = event_.get('coefficient')
        await UserWorker.update_add_score(user_id, coeff, local_session)

        await UserWorker.update_del_timer(user_id, local_session)

    @staticmethod
    async def decline_event(user_isu_number: int, event_id: int, local_session: get_session):
        await EventWorker.update_del_users_id_go(event_id, user_isu_number, local_session)
        event = await EventWorker.get(event_id, local_session)
        time_now = datetime.now()

        if time_now > (datetime.strptime(event['time_start'], "%m/%d/%Y, %H:%M:%S") - timedelta(config.TIME_TO_BAN)):
            await UserWorker.update_ban_date(user_isu_number, time_now + timedelta(config.BAN_TIME_LATE), local_session)
