from flask import Blueprint, jsonify, request
import pyrebase, json, os
from firebase_admin import credentials, firestore, initialize_app
from google.cloud.firestore import GeoPoint

api_path = os.path.join(os.path.dirname(__file__), "../../../firebaseConfig.json")
key_path = os.path.join(os.path.dirname(__file__), "../../../key.json")

with open(api_path) as f:
  firebaseConfig = json.loads(f.read())
firebase = pyrebase.initialize_app(firebaseConfig)
auth = firebase.auth()

cred = credentials.Certificate(key_path)
default_app = initialize_app(cred)
db = firestore.client()

api = Blueprint('geo', __name__, url_prefix='/api/geo')
@api.route('/<username>', methods=['GET'])
def get(username:str):
  data = db.collection(u'geo').document(username).get()
  if data.exists:
    data = data.to_dict()
    data['location'] = {'lat': data['location'].latitude, 'lng': data['location'].longitude}
    return jsonify(data), 200
  else:
    return jsonify(data.to_dict()), 404

@api.route('/<username>/<longitude>/<latitude>/<accuracy>', methods=['POST'])
def post(username:str, longitude:str, latitude:str, accuracy:str):
  data = {
    "location": GeoPoint(float(latitude), float(longitude)),
    "accuracy": float(accuracy)
  }

  db.collection(u'geo').document(username).set(data)
  return jsonify({'status': 'successful'}), 200
