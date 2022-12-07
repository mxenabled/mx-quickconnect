# frozen_string_literal: true

# Load env vars from .env file
require 'dotenv'
Dotenv.load('./../.env')
require_relative 'test-setup'

require 'base64'
require 'date'
require 'json'
require 'sinatra'
require 'sinatra/cross_origin'
require 'mx-platform-ruby'

set :port, ENV['APP_PORT'] || 8000

configure do
  enable :cross_origin
  set :protection, :except => [:json_csrf]
end

options '*' do
  response.headers['Access-Control-Allow-Methods'] = 'HEAD,GET,PUT,POST,DELETE'
  response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
  200
end

# MX Setup
::MxPlatformRuby.configure do |config|
  # Configure with your Client ID/API Key from https://dashboard.mx.com
  config.username = ENV['CLIENT_ID']
  config.password = ENV['API_KEY']

  # Configure environment. 0 for production, 1 for development
  config.server_index = ENV['DEVELOPMENT_ENVIRONMENT'] == 'production' ? 0 : 1
end

api_client = ::MxPlatformRuby::ApiClient.new
api_client.default_headers['Accept'] = 'application/vnd.mx.api.v1+json'
mx_platform_api = ::MxPlatformRuby::MxPlatformApi.new(api_client)

# Checks the env file and production config if in production mode
test_config(mx_platform_api)

get '/api/test' do
  { test: 'hit' }.to_json
end

def create_user(user_id, mx_platform_api)
  user_request = ::MxPlatformRuby::UserCreateRequest.new(
    is_disabled: false
  )
  user_request.id = user_id unless user_id.nil?
  request_body = ::MxPlatformRuby::UserCreateRequestBody.new(
    user: user_request
  )
  response = mx_platform_api.create_user(request_body)
  response.user.guid
end

get '/api/users' do
  content_type :json
  begin
    response = mx_platform_api.list_users
    response.to_hash.to_json
  rescue ::MxPlatformRuby::ApiError => e
    puts "Error when calling MxPlatformApi->list_users: #{e.message}"
    [400, e.response_body]
  end
end

delete '/api/user/:guid' do
  mx_platform_api.delete_user(params[:guid])
  { :user_guid => params[:guid] }.to_json
rescue ::MxPlatformRuby::ApiError => e
  puts "Error when calling MxPlatformApi->delete_user: #{e.message}"
  [400, e.response_body]
end

post '/api/get_mxconnect_widget_url' do
  content_type :json
  begin
    request.body.rewind # in case someone already read it
    data = JSON.parse(request.body.read)
    external_id = data['user_id'].empty? ? nil : data['user_id']

    # create user if no user_guid given
    user_guid = data['user_guid'].nil? ? create_user(external_id, mx_platform_api) : data['user_guid']

    request_body = ::MxPlatformRuby::WidgetRequestBody.new(
      widget_url: ::MxPlatformRuby::WidgetRequest.new(
        widget_type: 'connect_widget',
        is_mobile_webview: false,
        mode: 'verification',
        ui_message_version: 4,
        include_transactions: true,
        current_member_guid: data['current_member_guid']
      )
    )
    response = mx_platform_api.request_widget_url(user_guid, request_body)
    response.to_hash.to_json
  rescue ::MxPlatformRuby::ApiError => e
    puts "Error when calling MxPlatformApi->request_connect_widget_url: #{e.message}"
    [400, e.response_body]
  end
end

# Verification Endpoint
# because the connect widget is loaded in Verification mode we don't have to do a POST to verify_member first
get '/users/:user_guid/members/:member_guid/verify' do
  content_type :json
  begin
    # if widget was not in verification mode
    # mx_platform_api.verify_member(member_guid, user_guid)
    # poll member status answer MFAs
    response = mx_platform_api.list_account_numbers_by_member(params[:member_guid], params[:user_guid])
    response.to_hash.to_json
  rescue ::MxPlatformRuby::ApiError => e
    puts "Error when calling MxPlatformApi->list_account_numbers_by_member: #{e.message}"
    [400, e.response_body]
  end
end

post '/users/:user_guid/members/:member_guid/identify' do
  content_type :json
  begin
    response = mx_platform_api.identify_member(
      params[:member_guid],
      params[:user_guid]
    )
    response.to_hash.to_json
  rescue ::MxPlatformRuby::ApiError => e
    puts "Error when calling MxPlatformApi->identify_member: #{e.message}"
    [400, e.response_body]
  end
end

get '/users/:user_guid/members/:member_guid/identify' do
  content_type :json
  begin
    response = mx_platform_api.list_account_owners_by_member(
      params[:member_guid],
      params[:user_guid]
    )
    response.to_hash.to_json
  rescue ::MxPlatformRuby::ApiError => e
    puts "Error when calling MxPlatformApi->list_account_owners_by_member: #{e.message}"
    [400, e.response_body]
  end
end

get '/users/:user_guid/members/:member_guid/check_balance' do
  content_type :json
  begin
    response = mx_platform_api.list_user_accounts(params[:user_guid])
    response.to_hash.to_json
  rescue ::MxPlatformRuby::ApiError => e
    puts "Error when calling MxPlatformApi->list_user_accounts: #{e.message}"
    [400, e.response_body]
  end
end

post '/users/:user_guid/members/:member_guid/check_balance' do
  content_type :json
  begin
    response = mx_platform_api.check_balances(
      params[:member_guid],
      params[:user_guid]
    )
    response.to_hash.to_json
  rescue ::MxPlatformRuby::ApiError => e
    puts "Error when calling MxPlatformApi->check_balances: #{e.message}"
    [400, e.response_body]
  end
end

get '/users/:user_guid/members/:member_guid/transactions' do
  content_type :json
  begin
    response = mx_platform_api.list_transactions_by_member(
      params[:member_guid],
      params[:user_guid]
    )
    response.to_hash.to_json
  rescue ::MxPlatformRuby::ApiError => e
    puts "Error when calling MxPlatformApi->list_transactions_by_member: #{e.message}"
    [400, e.response_body]
  end
end

get '/users/:user_guid/members/:member_guid/status' do
  content_type :json
  begin
    response = mx_platform_api.read_member_status(
      params[:member_guid],
      params[:user_guid]
    )
    response.to_hash.to_json
  rescue ::MxPlatformRuby::ApiError => e
    puts "Error when calling MxPlatformApi->read_member_status: #{e.message}"
    [400, e.response_body]
  end
end
