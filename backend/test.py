from flask import Flask, request, jsonify, render_template, redirect, url_for, session
import pyrebase
import json, os, datetime
from firebase_admin import credentials, firestore, initialize_app

api_path = os.path.join(os.path.dirname(__file__), "firebaseConfig.json")
key_path = os.path.join(os.path.dirname(__file__), "key.json")
with open(api_path) as f:
  firebaseConfig = json.loads(f.read())
firebase = pyrebase.initialize_app(firebaseConfig)
auth = firebase.auth()

cred = credentials.Certificate(key_path)
default_app = initialize_app(cred)
db = firestore.client()

coordinate = db.collection(u'geo').document(u'template').get().to_dict()
print(coordinate)
