from gevent import monkey
monkey.patch_all()

from gevent.pywsgi import WSGIServer
import app

try:
    app.before_start()
    WSGIServer(('127.0.0.1', 80), app.app).serve_forever()
except KeyboardInterrupt:
    app.after_stop()