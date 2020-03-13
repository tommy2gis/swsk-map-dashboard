from flask_appbuilder import BaseView
from flask_appbuilder.api import expose
from superset import appbuilder
from superset.models.myModels import Test


class ApiTest(BaseView):
    # http://localhost:8080/api/hz/
    @expose('/hz/', methods=["GET"])
    def hz(self):
        cg = appbuilder.session.query(Test).filter_by(name='张三').first()

        # 将连接交还给连接池
        appbuilder.session.remove()

        if cg is not None:
            return str(cg.id) + " -- " + str(cg.name)
        else:
            return "查无记录"


appbuilder.add_view_no_menu(ApiTest)
