from flask import Flask, request, jsonify, render_template, redirect, url_for, session
import pyrebase
import json, os
from firebase_admin import credentials, firestore, initialize_app

with open("firebaseConfig.json") as f:
  firebaseConfig = json.loads(f.read())
firebase = pyrebase.initialize_app(firebaseConfig)
auth = firebase.auth()

cred = credentials.Certificate('key.json')
default_app = initialize_app(cred)
db = firestore.client()

app = Flask(__name__)
app.config['SECRET_KEY'] = os.urandom(24)
friends_default = {
  'blocked': [],
  'friends': [],
  'receivedRequests': [],
  'sentRequests': []
}

class Account():
  def __init__(self, attributes:dict, friends:dict=friends_default) -> None:
    self.attributes = attributes
    self.username = attributes['username']
    self.email = attributes['email']
    self.uid = attributes['uid']

    self.friends_dict = friends
    self.blocked = friends['blocked']
    self.friends = friends['friends']
    self.received = friends['receivedRequests']
    self.sent = friends['sentRequests']

    self.attributes_ref = db.collection(u'users').document(self.username).collection(u'userdata').document(u'attributes')
    self.friends_ref = db.collection(u'users').document(self.username).collection(u'friends').document(u'friends')

  def register(self) -> None:
    self.attributes_ref.set(self.attributes)
    self.friends_ref.set(self.friends_dict)

  def friend_request(self, subject) -> None:
    client_fblist = set([i for i in self.friends.keys()]+[j for j in self.blocked.keys()])

    if subject.username in client_fblist or self.username in subject.blocked:
      return render_template('friend_search.html', msg='The selected user either is already your friend or have blocked you.')

    if self.username in subject.sent:
      self.friend_approve(subject)

    subject.friends_ref.update({u'receivedRequests': firestore.ArrayUnion([self.username])})
    self.friends_ref.update({u'sentRequests': firestore.ArrayUnion([subject.username])})


  def friend_approve(self, subject) -> None:
    self.friends_ref.update({u'friends': firestore.ArrayUnion([subject.username])})
    subject.friends_ref.update({u'friends': firestore.ArrayUnion([self.username])})

    self.friends_ref.update({u'sentRequests': firestore.ArrayRemove([subject.username])})
    self.friends_ref.update({u'receivedRequests': firestore.ArrayRemove([subject.username])})
    subject.friends_ref.update({u'sentRequests': firestore.ArrayRemove([self.username])})
    subject.friends_ref.update({u'receivedRequests': firestore.ArrayRemove([self.username])})


# firebaseから特定ユーザーの全データを取得
def get_all(username:str) -> dict:
  attributes = db.collection(u'users').document(username).collection(u'userdata').document(u'attributes').to_dict()
  friends = db.collection(u'users').document(username).collection(u'friends').document(u'friends').to_dict()

  return attributes, friends

# ログイン時の操作
@app.route('/login', methods=['GET', 'POST'])
def login():
  if request.method == 'GET':
    return render_template("login.html",msg="")

  email = request.form['email']
  password = request.form['password']
  try:
    user = auth.sign_in_with_email_and_password(email, password)
    session['usr'] = email
    return redirect(url_for('index'))
  except:
    return render_template("login.html", msg="メールアドレスまたはパスワードが間違っています。")

# アカウント登録時の操作
@app.route('/signup', methods=['GET', 'POST'])
def signup():
  if request.method == 'GET':
    return render_template("signup.html", msg="")

  email = request.form['email']
  password = request.form['password']
  username = request.form['username']
  try:
    doc = db.collection(u'users').document(username).get()
    if doc.exists:
      return render_template("signup.html", msg="")

    user = auth.create_user_with_email_and_password(email, password)
    uid = user['uid']
    data = {
      'username': username,
      'uid': uid,
      'email': email
    }
    data = Account(data)
    data.register()
    return render_template("signedup.html", msg="")

  except:
    return render_template("signup.html", msg="メールアドレスが既に使用されているか、予期しないエラーが発生しました。")


@app.route('/friend_search.html', methods=['GET', "POST"])
def search():
  if request.method == 'GET':
    # フレンドリストを見せる処理
    return 0

  try:
    client_username = request.form['client_username']
    subject_username = request.form['subject_username']
    client_attributes, client_friends = get_all(client_username)
    subject_attributes, subject_friends = get_all(subject_username)
    if not subject_attributes.exists:
      return render_template('friend_list.html', msg="")

    client = Account(client_attributes, client_friends)
    subject = Account(subject_attributes, subject_friends)
    client.friend_request(subject)

  except:
    return render_template('friend_search', msg="An unexpected error has occurred")

# 起動時の処理
@app.route("/", methods=['GET'])
def index():
  # print(db.collection(u'users').document(u'template').collection(u'userdata').document(u'attributes').get().to_dict())
  usr = session.get('usr')
  if usr == None:
    return redirect(url_for('login'))
  return render_template("index.html", usr=usr)

# ログアウト時の処理(未実装)
@app.route('/logout')
def logout():
  del session['usr']
  return redirect(url_for('login'))

# run the app.
if __name__ == "__main__":
  app.debug = True
  app.run(port=5000)
