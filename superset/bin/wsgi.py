from superset import app, config

if __name__ == '__main__':
    #  ---------------- 不要用debug模式，session会失效 ----------------
    # print(app.url_map)
    startModel = config.startModel.lower()
    if startModel == "default":
        app.run(host="0.0.0.0", port=config.webPort, debug=False, threaded=True)
    elif startModel == "tornado":
        from tornado.wsgi import WSGIContainer
        from tornado.httpserver import HTTPServer
        from tornado.ioloop import IOLoop

        http_server = HTTPServer(WSGIContainer(app))
        http_server.listen(config.webPort, "0.0.0.0")
        IOLoop.instance().start()
