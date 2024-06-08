# Set up:
    # cd into server and run the following in the terminal
    # export FLASK_APP=app.py exporting these to flask
    # export FLASK_RUN_PORT=5000
    # flask db init
    # flask db revision --autogenerate -m'Create tables' or flask db migrate -m "created tables"
    # flask db upgrade 
    # python seed.py


from flask import Flask, request, make_response, abort, jsonify, session
from flask_migrate import Migrate
from werkzeug.exceptions import NotFound
from flask_cors import CORS
from flask_restful import Api, Resource
from models import db, User, Comment, Trip, Friend

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.json.compact = False
migrate = Migrate(app, db)
db.init_app(app)
api = Api(app)
CORS(app)

app.secret_key=b'\xa8\xd6\xe0\xb3\x83\x03\xe3\xe2\xc8\r\xc3\x1c\xc8w\xcd\xdd'

@app.before_request
def check_session():
    if session.get("user.id") is None:
        session["user_id"] = None
    else:
        print("user is logged in")
        print({session["user_id"]})

class Signup(Resource):

  def post(self):
    form_json = request.get_json()
    new_user = User(
        username=form_json["username"],
        password=form_json["password"],
    )
    db.session.add(new_user)
    db.session.commit()
    session["user_id"] = new_user.id
    print(session["user_id"])
    
    return new_user.to_dict(), 201
api.add_resource(Signup, "/signup")

class Logout(Resource):
    def delete(self):
        if session.get("user_id"):
            session["user_id"] = None
        return {},204
api.add_resource(Logout, "/logout")

class Login(Resource):
    def post(self):
        form = request.get_json()
        
        username = form["username"]
        password = form["password"]
        user = User.query.filter_by(username=username).first()
        if user and user.authenticate(password):
            session["user_id"] = user.id
            return user.to_dict(),200
        else:
            return "invalid credentials", 401
api.add_resource(Login, "/login")

class CheckSession(Resource):
    def get(self):
        user_id = session["user_id"]
        
        if user_id:
            print("inside check session")
            user = User.query.filter(User.id == user_id).first()
            return user.to_dict(),200
        else: 
            print("inside else check session")
            return {}, 401
api.add_resource(CheckSession, "/check_session")
            


class UserById(Resource):
  def get(self, id):
    user = User.query.filter_by(id=id).first()
    if not user:
      abort(404, "The production was not found")
    
    return user.to_dict(),200
  
  def patch(self,id):
    user = User.query.filter_by(id=id).first()
    if not user:
      abort(404, "Production not found")
    
    data = request.get_json()
    for key in data:
      setattr(user,key,data[key])
    db.session.add(user)
    db.session.commit()
    
    return user.to_dict(),202
  
  def delete(self,id):
    user = User.query.filter_by(id=id).first()
    if not user:
      # abort(404,"production not found")
      return handle_not_found(NotFound())
    db.session.delete(user)
    db.session.commit()
api.add_resource(UserById, '/user/<int:id>')


class Comments(Resource):
    
    def get(self):
        comments = [comment.to_dict() for comment in Comment.query.all()]
        return comments, 200
    
    def post(self):
        data = request.get_json()
        new_comment = Comment(
            tweet = data['tweet'],
            user_id = data['user_id'],
            # id = data['id'],
            lat = data['lat'],
            lng = data['lng']
        )
        db.session.add(new_comment)
        db.session.commit()
api.add_resource(Comments, "/comments")

class CommentsByID(Resource):
    def get(self,id):
        comment = Comment.query.filter_by(id=id).first()
        if not comment:
            abort(404, "The comment was not found")
    
        return comment.to_dict(),200
    
    def patch(self,id):
        comment = Comment.query.filter_by(id=id).first()
        if not comment:
            abort(404, "Production not found")
    
        data = request.get_json()
        for key in data:
            setattr(comment,key,data[key])
        db.session.add(comment)
        db.session.commit()
    
        return comment.to_dict(),202
    
    def delete(self,id):
        comment = Comment.query.filter_by(id=id).first()
        if not comment:
      # abort(404,"production not found")
            return handle_not_found(NotFound())
        db.session.delete(comment)
        db.session.commit()
        
api.add_resource(CommentsByID, '/comments/<int:id>')

class Trips(Resource):
    def get(self):
        dest = [I.to_dict() for I in Trip.query.all()]
        return dest, 200
    def post(self):
        data = request.get_json()
        new_trip = Trip(
            destination=data['destination'],
            user_id=data['user_id'],
            start=data['start']
        )
        db.session.add(new_trip)
        db.session.commit()
        
api.add_resource(Trips, '/trips')

class Friends(Resource):
    def get(self):
        friends = [I.to_dict() for I in Friend.query.all()]
        return friends, 200
    
    def post(self):
        data= request.get_json()
        new_friend = Friend(
            id = data["id"],
            selfuser_id = data["selfuser_id"],
            friend_id = data["friend_id"]
        )
        db.session.add(new_friend)
        db.session.commit()
api.add_resource(Friends, "/friends")



#13. Use the @app.errorhandler() decorator to handle Not Found
    # 2.1 Create the decorator and pass it NotFound
    # 2.2 Use make_response to create a response with a message and the status 404
    # 2.3 return the response
@app.errorhandler(NotFound)
def handle_not_found(e):
  return make_response("Not found: The resource was not found", 404 )
# To run the file as a script
if __name__ == '__main__':
    app.run(port=4000, debug=True)