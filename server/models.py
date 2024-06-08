#flask db upgrade

#flask db migrate

from flask_sqlalchemy import SQLAlchemy
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import validates
from sqlalchemy import Numeric, MetaData
from sqlalchemy.ext.hybrid import hybrid_property
from flask_bcrypt import Bcrypt

bcrypt = Bcrypt()

metadata = MetaData(naming_convention={
    "ix": "ix_%(column_0_label)s",
    "uq": "uq_%(table_name)s_%(column_0_name)s",
    "ck": "ck_%(table_name)s_`%(constraint_name)s`",
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    "pk": "pk_%(table_name)s"
    })

db = SQLAlchemy(metadata=metadata)
#Review
#Import validates from sqlalchemy.orm

# db = SQLAlchemy()



class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(345), unique=True, nullable=False)
    _password_hash = db.Column(db.Text, nullable=False)
    
    
    
    
    comments = db.relationship('Comment', back_populates="users")
    destinations = db.relationship('Trip', back_populates='users')
    # friends = db.relationship('Friend', back_populates='users')
    selfUser = db.relationship('Friend', foreign_keys='Friend.selfuser_id', back_populates='user')
    friendUser = db.relationship('Friend', foreign_keys='Friend.friend_id', back_populates='friend')

    # serialize_rules = ('-comments.users','-destinations.users','-friends.users')
    serialize_rules = ('-comments.users', '-destinations.users', '-selfUser', '-friendUser')

    @hybrid_property
    def password_hash(self):
        return self._password_hash
    
    @password_hash.setter
    def password(self, password):
        password_hash = bcrypt.generate_password_hash(password.encode('utf-8'))
        self._password_hash = password_hash.decode("utf-8")
        
    def authenticate(self, password):
        return bcrypt.check_password_hash(self.password_hash, password.encode("utf-8"))

    @validates("username","password")
    def validate_title(self, key, value):
      if not value:
        raise ValueError("Username and password cannot be empty")
      return value
  

    def __repr__(self):
        return f'<Username:{self.username}, password:{self.password}, ID:{self.id}'

class Comment(db.Model, SerializerMixin):
    __tablename__ = 'comments'

    id = db.Column(db.Integer, primary_key=True)
    tweet = db.Column(db.String)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    lat = db.Column(Numeric(scale = 8))
    lng = db.Column(Numeric(scale = 8))
    
    
    serialize_rules = ('-users.comments',)
    
    users = db.relationship('User', back_populates='comments')
    
    @validates("tweet")
    def validate(self, key, value):
        if not value:
            raise ValueError("Comment cannot be empty")
        return value

class Trip(db.Model, SerializerMixin):
    __tablename__ = 'destinations'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    destination = db.Column(db.String, nullable=False)
    start = db.Column(db.String, nullable=False)
    
    serialize_rules = ('-users.destinations',)
    
    users = db.relationship('User', back_populates='destinations')
    
class Friend(db.Model, SerializerMixin):
    __tablename__ = 'friends'
    
    id = db.Column(db.Integer, primary_key=True)
    selfuser_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    friend_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    
    # user = db.relationship("User", back_populates="selfUser", foreign_keys=[selfuser_id])
    # friend = db.relationship("User", back_populates="friendUser", foreign_keys=[friend_id])
    user = db.relationship("User", back_populates="selfUser", foreign_keys=[selfuser_id])
    friend = db.relationship("User", back_populates="friendUser", foreign_keys=[friend_id])
   
   
   
    
    
    
    # serialize_rules = ('-users.friends',)
    serialize_rules = ('-user', '-friend')