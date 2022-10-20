from flask import Flask
from app.apis import geo

app = Flask(__name__)
app.register_blueprint(geo.api)
