#!/usr/bin/env python3
from faker import Faker
import random
from app import app
from models import db, User, Trip, Comment, Friend


faker = Faker()


def seed_tweets(n):
    comments = []
   
    while len(comments) < n:
        tweet = faker.paragraph(nb_sentences=1)
        user_id = random.randrange(1, 10)
        lat = (random.uniform(39.0, 41.0))
        lng = (random.uniform(-105,  -104))
        comment = Comment(
            tweet = tweet,
            user_id = user_id,
            lat = lat,
            lng = lng
            
        )
        comments.append(comment)
    db.session.add_all(comments)
    db.session.commit()
    
def seed_users():
    
    
    admin = User(username="admin", password="password", id=1)
    a = User(username="Happy Trucker",password="password", id=2)
    b = User(username="Sad Trucker",password="password", id=3)
    c = User(username="Little Trucker",password="password", id=4)
    d = User(username="No Trucker",password="password", id=5)
    e = User(username="Big Trucker",password="password", id=6)
    f = User(username="Fuzzy Trucker",password="password", id=7)
    g = User(username="Skinny Trucker",password="password", id=8)
    h = User(username="Fierce Trucker",password="password", id=9)
    i = User(username="Mother Trucker",password="password", id=10)
    j = User(username="Daddy Trucker",password="password", id=11)
    
    db.session.add(admin)
    db.session.add(a)
    db.session.add(b)
    db.session.add(c)
    db.session.add(d)
    db.session.add(e)
    db.session.add(f)
    db.session.add(g)
    db.session.add(h)
    db.session.add(i)
    db.session.add(j)
    db.session.commit()
    
def seed_friends():
    test = Friend(id= 1, selfuser_id=1, friend_id=2)
    db.session.add(test)
    db.session.commit()
    

    
            

# def seed_users(n):  # Number of users to create
#     known_password = "password"  # You may choose a different known password
#     hashed_password = bcrypt.generate_password_hash(
#         known_password).decode('utf-8')
#     role = "none"
#     for _ in range(n):
#         username = faker.user_name()
#         user = User(
#             username=username, 
#             password=hashed_password,
#             role=role
            
#         )
#         db.session.add(user)
#     db.session.commit()

#     print(f"Seeded {n} users with the known password: {known_password}")

# def seed_data():
#     user_ids = [user.id for user in User.query.all()]
    
#     if not user_ids:
#         print("No users found. Seeding users...")
#         seed_users(n=10)
#         user_ids = [user.id for user in User.query.all()]

#     # Seed comments
#     seed_trips(user_ids)

    

#     print("Database seeded")

if __name__ == "__main__":
    with app.app_context():  
        Comment.query.delete()
        User.query.delete()
        seed_tweets(40)
        seed_users()
        seed_friends()
        # seed_users(10)
    # User.query.delete()
    
    # Trip.query.delete()
    # Friend.query.delete()
    