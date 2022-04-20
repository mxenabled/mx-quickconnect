import mx_platform_python
import os

from flask import Flask, abort, request
from dotenv import load_dotenv
from mx_platform_python.api import mx_platform_api
from mx_platform_python.models import *

load_dotenv('./../.env')

app = Flask(__name__)

configuration = mx_platform_python.Configuration(
  # Configure with your Client ID/API Key from https://dashboard.mx.com
  username = os.environ.get("CLIENT_ID"),
  password = os.environ.get("API_KEY"),

  # Configure environment. https://int-api.mx.com for development, https://api.mx.com for production
  host = ['https://int-api.mx.com', 'https://api.mx.com'][os.environ.get("DEVELOPMENT_ENVIRONMENT") == 'production']
)

with mx_platform_python.ApiClient(configuration, 'Accept', 'application/vnd.mx.api.v1+json') as api_client:
  api_instance = mx_platform_api.MxPlatformApi(api_client)

  @app.route("/test")
  def test():
    try:
      response = api_instance.list_users()
      return response.to_dict()
    except mx_platform_python.ApiException as e:
      print("Exception when calling MxPlatformApi->list_users: %s\n" % e)
      abort(400)

  @app.route('/api/get_mxconnect_widget_url', methods=['POST'])
  def get_mxconnect_widget_url():
    request_body = UserCreateRequestBody(
      user = UserCreateRequest(
        metadata = ''
      )
    )

    try:
      response = api_instance.create_user(request_body)

      user_guid = response.user.guid
      current_member_guid = request.form.get('current_member_guid')

      widget_request = WidgetRequest(
        widget_type = 'connect_widget',
        is_mobile_webview = False,
        mode = 'verification',
        ui_message_version = 4,
        include_transactions = True,
        wait_for_full_aggregation = True,
      )

      if current_member_guid:
        widget_request.current_member_guid = current_member_guid

      widget_request_body = WidgetRequestBody(
        widget_url = widget_request
      )

      widget_response = api_instance.request_widget_url(user_guid, widget_request_body)

      return widget_response.to_dict()
    except mx_platform_python.ApiException as e:
      print("Exception when calling MxPlatformApi->get_mxconnect_widget_url: %s\n" % e)
      abort(400)

  @app.route('/users/<user_guid>/members/<member_guid>/verify', methods=['GET'])
  def verify(user_guid, member_guid):
    try:
      response = api_instance.list_account_numbers_by_member(member_guid, user_guid)
      return response.to_dict()
    except mx_platform_python.ApiException as e:
      print("Exception when calling MxPlatformApi->list_account_numbers_by_member: %s\n" % e)
      abort(400)

  @app.route('/users/<user_guid>/members/<member_guid>/identify', methods=['GET', 'POST'])
  def identify(user_guid, member_guid):
    try:
      if request.method == 'POST':
        response = api_instance.identify_member(member_guid, user_guid)
      else:
        response = api_instance.list_account_owners_by_member(member_guid, user_guid)
      return response.to_dict()
    except mx_platform_python.ApiException as e:
      print("Exception when calling MxPlatformApi->identify_member: %s\n" % e)
      abort(400)

  @app.route('/users/<user_guid>/members/<member_guid>/check_balance', methods=['GET', 'POST'])
  def balances(user_guid, member_guid):
    try:
      if request.method == 'POST':
        response = api_instance.check_balances(member_guid, user_guid)
      else:
        response = api_instance.list_user_accounts(user_guid)
      return response.to_dict()
    except mx_platform_python.ApiException as e:
      print("Exception when calling MxPlatformApi->check_balances: %s\n" % e)
      abort(400)

  @app.route('/users/<user_guid>/members/<member_guid>/transactions', methods=['GET'])
  def transactions(user_guid, member_guid):
    try:
      response = api_instance.list_transactions_by_member(member_guid, user_guid)
      return response.to_dict()
    except mx_platform_python.ApiException as e:
      print("Exception when calling MxPlatformApi->list_transactions_by_member: %s\n" % e)
      abort(400)

  @app.route('/users/<user_guid>/members/<member_guid>/status', methods=['GET'])
  def check_member_status(user_guid, member_guid):
    try:
      response = api_instance.read_member_status(member_guid, user_guid)
      return response.to_dict()
    except mx_platform_python.ApiException as e:
      print("Exception when calling MxPlatformApi->read_member_status: %s\n" % e)
      abort(400)
