import sqlalchemy as sa

from data_base.base import Base, settings


class Token(Base):
    __tablename__ = settings.TBL_TOKEN

    id_user = sa.Column('user_id', sa.Integer, unique=True, primary_key=True)
    access_token = sa.Column('access_token', sa.TEXT, unique=True)
    refresh_token = sa.Column('refresh_token', sa.TEXT)

