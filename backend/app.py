from flask import Flask, request, jsonify, session
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import json
import os
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///users.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)

rooms = {}

#region baza danych
#region User
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    firstname = db.Column(db.String(20), nullable=False)
    lastname = db.Column(db.String(20), nullable=False)
    phone = db.Column(db.String(9), unique=True, nullable=False)
    city = db.Column(db.String(50), nullable=False)
    street = db.Column(db.String(50), nullable=False)
    number = db.Column(db.String(10), nullable=False)
    zipcode = db.Column(db.String(6), nullable=False)
    role = db.Column(db.String(20), default="user")

with app.app_context():
    db.create_all()
#endregion
#endregion

ORDERS_FILE = "orders.json"

def load_orders():
    with open(ORDERS_FILE, "r") as f:
        try:
            return json.load(f)
        except json.JSONDecodeError:
            return {"orders": []}
        
def save_orders(orders):
    with open(ORDERS_FILE, "w") as f:
        json.dump(orders, f, indent=4)

#region login+register
@app.route("/login", methods=["POST"])
def login():
    data = request.json
    username = data.get("username")
    password = data.get("password")
    
    user = User.query.filter_by(username=username).first()
    if user and check_password_hash(user.password, password):
        return jsonify({"success": True, "role": user.role, "username": username}), 200
    return jsonify({"success": False, "message": "Złe dane do logowania"}), 400

@app.route("/register", methods=["POST"])
def register():
    data = request.json
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")
    firstname = data.get("firstname")
    lastname = data.get("lastname")
    phone = data.get("phone")
    city = data.get("city")
    street = data.get("street")
    number = data.get("number")
    zipcode = data.get("zipcode")

    if User.query.filter_by(username=username).first():
        return jsonify({"success": False, "message": "Login jest już zajęty"}), 400
    
    if User.query.filter_by(email=email).first():
        return jsonify({"success": False, "message": "Email jest już zajęty"}), 400
    
    if User.query.filter_by(phone=phone).first():
        return jsonify({"success": False, "message": "Numer telefonu jest już używany"}), 400
    
    hashed_password = generate_password_hash(password)
    new_user = User(username=username, email=email, password=hashed_password, firstname=firstname, lastname=lastname, phone=phone, city=city, street=street, number=number, zipcode=zipcode)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"success": True, "message": "Rejestracja udana. Proszę się zalogować"}), 201

#endregion

@app.route("/order/user/<username>", methods=["POST"])
def add_order(username):
    data = request.json
    order_items = data.get("items")
    discount = data.get("discount")

    if not order_items:
        return jsonify({"success": False, "message": "Brak produktów w zamówieniu"}), 400

    orders = load_orders()
    orders["orders"].append({"username": username, "items": order_items, "discount": discount})
    save_orders(orders)

    return jsonify({"success": True, "message": "Zamówienie zapisane"}), 201


#region admin
@app.route("/order/orders", methods=["GET"])
def get_all_orders():

    orders = load_orders()
    return jsonify(orders["orders"])


@app.route("/order/orders", methods=["DELETE"])
def delete_order():
    data = request.json
    index = data.get("index")

    if index is None:
        return jsonify({"success": False, "message": "Brak indeksu zamówienia"}), 400

    orders = load_orders()

    if index < 0 or index >= len(orders["orders"]):
        return jsonify({"success": False, "message": "Nieprawidłowy indeks"}), 400

    del orders["orders"][index]

    save_orders(orders)

    return jsonify({"success": True, "message": "Zamówienie usunięte"}), 200

#endregion
if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0")
