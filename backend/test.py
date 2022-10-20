from flask import Flask, request, jsonify, render_template, redirect, url_for, session
import pyrebase
import json, os, datetime
from firebase_admin import credentials, firestore, initialize_app

with open("firebaseConfig.json") as f:
  firebaseConfig = json.loads(f.read())
firebase = pyrebase.initialize_app(firebaseConfig)
auth = firebase.auth()

cred = credentials.Certificate('key.json')
default_app = initialize_app(cred)
db = firestore.client()

print(datetime.datetime.now())
db.collection(u'geo').document(u'test').update({u'test': u'test'})
print(datetime.datetime.now())
