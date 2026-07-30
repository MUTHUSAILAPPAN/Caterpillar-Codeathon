import os
from dotenv import load_dotenv

# Walk up from app/core/ to find the root .env
for _levels in ['../../.env', '../../../.env', '../../../../.env']:
    _path = os.path.join(os.path.dirname(__file__), _levels)
    if os.path.exists(_path):
        load_dotenv(dotenv_path=_path)
        break

DATABASE_URL = os.getenv("DATABASE_URL", "")
JWT_SECRET = os.getenv("JWT_SECRET", "secret")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 hours

ADMIN_EMAIL = "admin@fleetwatch.ac.in"
ADMIN_PASSWORD = "and123"
