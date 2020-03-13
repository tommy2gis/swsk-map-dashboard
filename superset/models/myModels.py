from tokenize import String

from flask_appbuilder import Model
from sqlalchemy import Column, Integer, Text, String


class Test(Model):
    __tablename__ = "test"
    id = Column(Integer, primary_key=True)
    name = Column(String(50), unique=True, nullable=False)