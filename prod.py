from gevent import monkey
monkey.patch_all()

from gevent.pywsgi import WSGIServer
import server

server.before_start()
WSGIServer(('127.0.0.1', 80), server.app).serve_forever()
server.after_stop()