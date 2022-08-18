from sqlalchemy import create_engine
from CONFIG import CONN

DATABASE_URL = 'mysql+mysqlconnector://{username}:{password}@{host}:{port}/{database}'.format(**CONN)
engine = create_engine(DATABASE_URL)
