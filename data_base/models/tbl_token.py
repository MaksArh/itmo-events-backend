import sqlalchemy as sa

from data_base.base import Base, settings


class Token(Base):
    __tablename__ = settings.TBL_TOKEN

    user_id = sa.Column('user_id', sa.Integer, unique=True)
    access_token = sa.Column('user_id', sa.TEXT, unique=True)
    refresh_token = sa.Column('user_id', sa.TEXT)
