from superset import app, config

from flask_cas import CAS
# from flask_cas import login as casLogin
# from flask_cas import logout as casLogout
myCas = CAS(app)

# 改 app.config.get
app.config['CAS_SERVER'] = config.CAS_SERVER
# app.config['CAS_SERVER'] = 'http://geowx.imwork.net:10498/cas'
# app.config['CAS_AFTER_LOGIN'] = 'MyAuthRemoteUserView.login'
app.config['SECRET_KEY'] = config.SECRET_KEY
