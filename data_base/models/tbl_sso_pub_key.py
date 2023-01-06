import sqlalchemy as sa

from data_base.base import Base, settings


class SsoPubKey(Base):
    __tablename__ = settings.TBL_SSO_PUB_KEY

    id_user = sa.Column('user_id', sa.Integer, unique=True, primary_key=True)
    access_token = sa.Column('access_token', sa.TEXT, unique=True)
    refresh_token = sa.Column('refresh_token', sa.TEXT)
#
# {
#   "keys": [
#     {
#       "kid": "BZJy3x3RRGRwRW0WSRcipPOLCxFDvOTTmlgj1zW9ucQ",
#       "kty": "RSA",
#       "alg": "RS256",
#       "use": "sig",
#       "n": "74L9vMaiOha0ivyVHfHNUJG-RANNcAIUrIUCOXOSp9fN8kfKr1rACsnsHClpRpA3ZYBHkYSK7b-TxnUZHGfdD59WqFI4XuU33YrZ5Nj3omBBxXk3hpBFKh0mBbCvful0TCbjHxPH0yYPs89qqzkn6aM2sN1I31XRVMmy14BWybLG6MB1gIrCuQrygVXmZM6_IPWAHylHnE6nM5nJ5FUpVOvLQgzpZnCVCmCOBZhcL1Uqw8OxkKJda9jq5vPov41lHNXw1riLXwvNRihH0c36LjD96dyri_s5vdv44qzMsUOvklo3UWs-eezM0okwkyMq1L2wAvdTifmtYHUcK28NSQ",
#       "e": "AQAB",
#       "x5c": [
#     "MIIClzCCAX8CBgF3HENMJDANBgkqhkiG9w0BAQsFADAPMQ0wCwYDVQQDDARpdG1vMB4XDTIxMDExOTIwMDY0OFoXDTMxMDExOTIwMDgyOFowDzENMAsGA1UEAwwEaXRtbzCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAO+C/bzGojoWtIr8lR3xzVCRvkQDTXACFKyFAjlzkqfXzfJHyq9awArJ7BwpaUaQN2WAR5GEiu2/k8Z1GRxn3Q+fVqhSOF7lN92K2eTY96JgQcV5N4aQRSodJgWwr37pdEwm4x8Tx9MmD7PPaqs5J+mjNrDdSN9V0VTJsteAVsmyxujAdYCKwrkK8oFV5mTOvyD1gB8pR5xOpzOZyeRVKVTry0IM6WZwlQpgjgWYXC9VKsPDsZCiXWvY6ubz6L+NZRzV8Na4i18LzUYoR9HN+i4w/encq4v7Ob3b+OKszLFDr5JaN1FrPnnszNKJMJMjKtS9sAL3U4n5rWB1HCtvDUkCAwEAATANBgkqhkiG9w0BAQsFAAOCAQEAjjzSQnK1gaDOoiDEDh1/pVsYWvQCD9I/hKNgKoIuvWNzdAE7u/AJxhVZgus7sGJiHpEls51NKlDi0Vu7EJNxRC1cZq1c5X/7rFZbSYC8siH8QOgli2DBvoiq8oHXS/Qw9U9CKEm6W3dShRM5BcBJtDk4rIH5VapAttCxlP29P4V+t5UzFJXgbRFBm/jdt3c5WQNpfbCONZtdW1bz0QTPldrJHjOVNziaQ+3Rkk6C/7nHfM8eYlZefRlnaCzZdlImU5PKFCVBGp4lbsIPZz/Ne+FP4VTNe5EMX5BIGmydoMcuju+OnZqJ5hL4U59slqZISY0cWNvuE+dwGE4PcenBCg=="
#       ],
#       "x5t": "bwP0J5CaPkhzf_sptc4jMSSQXHU",
#       "x5t#S256": "jHjSvbOsmLzHeN70cD946e6__ks2YpU3PSUukPRadwQ"
#     }
#   ]
# }