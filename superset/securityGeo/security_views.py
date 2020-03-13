# -*- coding: utf-8 -*-
from __future__ import absolute_import
from __future__ import division
from __future__ import print_function
from __future__ import unicode_literals

from flask_cas import login_required
from superset.cas import myCas
from flask import g, redirect, flash, url_for
from flask_appbuilder._compat import as_unicode
from flask_appbuilder.forms import DynamicForm
from flask_appbuilder.security.views import AuthRemoteUserView, expose
from flask_babel import lazy_gettext
from flask_login import login_user
from wtforms import StringField, PasswordField
from wtforms.validators import Required, Email, DataRequired

# import the remote server here
# remote server API to authenticate username/Email
from . import remote_server_api

import logging

logger = logging.getLogger(__name__)


class MyLoginForm(DynamicForm):
    """
    My customize login form, only set email and password as login request
    more options could be set here
    """
    email = StringField(lazy_gettext("User Name"), validators=[DataRequired()])
    password = PasswordField(lazy_gettext("Password"), validators=[DataRequired()])


class MyAuthRemoteUserView(AuthRemoteUserView):
    # 走自己的登录页面，走接口登录
    # this front-end template should be put under the folder `superset/templates/appbuilder/general/security`
    # so that superset could find this templates to render

    # login_template = 'appbuilder/general/security/login_my.html'
    # title = "geo data login"
    # this method is going to overwrite
    # https://github.com/dpgaspar/Flask-AppBuilder/blob/master/flask_appbuilder/security/views.py#L556
    # @expose('/login/', methods=['GET', 'POST'])
    # def login(self):
    #     logger.info("My special login...")
    #     if g.user is not None:
    #         if g.user.is_authenticated:
    #             # if session.get("user_id") is not None and session.get("user_id") != "":
    #             return redirect(self.appbuilder.get_url_for_index)
    #
    #     form = MyLoginForm()
    #     if form.validate_on_submit():
    #         logger.info("going to auth MY user: %s" % form.email.data)
    #         my_user = remote_server_api.authenticate(form.email.data, form.password.data)
    #         # if my_user is authenticated
    #         if my_user:
    #             user = self.appbuilder.sm.auth_user_remote_user(my_user.get('username'))
    #             if user is None:
    #                 flash(as_unicode(self.invalid_login_message), 'warning')
    #             else:
    #                 login_user(user)
    #                 return redirect(self.appbuilder.get_url_for_index)
    #         else:
    #             flash(as_unicode(self.invalid_login_message), 'warning')
    #     else:
    #         if form.errors.get('email') is not None:
    #             flash(
    #                 as_unicode(" ".join(form.errors.get('email'))), 'warning')
    #
    #     return self.render_template(
    #         self.login_template,
    #         title=self.title,
    #         form=form,
    #         appbuilder=self.appbuilder)

    # cas单点登录

    # ######################  cas 单点登录 ################################
    @expose('/login/', methods=['GET', 'POST'])
    @login_required
    def login(self):
        print("单点登录， myCas.username = {}".format(myCas.username))
        # 信息更新用户表
        user = self.appbuilder.sm.auth_user_remote_user(myCas.username)
        # user = None
        if user is None:
            flash(as_unicode(self.invalid_login_message), 'warning')
        else:
            login_user(user)
            return redirect(self.appbuilder.get_url_for_index)

        return redirect(self.appbuilder.get_url_for_index)

    # 登出
    @expose("/logout/", methods=['GET', 'POST'])
    def logout(self):
        # casLogout()
        print("用户登出， myCas.username = {}".format(myCas.username))
        if myCas.username is None:
            return redirect(url_for("login"))
        return redirect(url_for("cas.logout"))
