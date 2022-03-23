# Load env vars from .env file
require 'dotenv'
Dotenv.load('./../.env')

require 'base64'
require 'date'
require 'json'
require 'sinatra'
require 'sinatra/cross_origin'

require 'mx-platform-ruby'

set :port, ENV['APP_PORT'] || 8000

configure do
  enable :cross_origin
end

options "*" do
  response.headers["Access-Control-Allow-Methods"] = "HEAD,GET,PUT,POST,DELETE,OPTIONS"
  response.headers["Access-Control-Allow-Headers"] = "Content-Type"
  200
end

# MX Setup
# persistant data store
user_guid = 'USR-a236b5f9-5e4b-4520-949f-a64702de2aa7'
member_guid = 'MBR-308badb0-2f71-438e-bfc6-3da976bf3655'

::MxPlatformRuby.configure do |config|
  # Configure with your Client ID/API Key from https://dashboard.mx.com
  config.username = ENV['CLIENT_ID']
  config.password = ENV['API_KEY']

  # Configure environment. 0 for production, 1 for development
  config.server_index = 1
end

api_client = ::MxPlatformRuby::ApiClient.new
api_client.default_headers['Accept'] = 'application/vnd.mx.api.v1+json'
mx_platform_api = ::MxPlatformRuby::MxPlatformApi.new(api_client)

# request_body = ::MxPlatformRuby::UserCreateRequestBody.new(
#   user: ::MxPlatformRuby::UserCreateRequest.new(
#     metadata: 'Creating a user!'
#   )
# )

get '/api/test' do
  { :test => 'hit' }.to_json
end

get '/api/users' do
  content_type :json
  begin
    response = mx_platform_api.list_users
    response.to_json
  rescue ::MxPlatformRuby::ApiError => e
    puts "Error when calling MxPlatformApi->create_user: #{e}"
    JSON.parse(err.response_body)
  end
end

get '/api/get_mxconnect_widget_url' do
  content_type :json

  begin
    request_body = ::MxPlatformRuby::WidgetRequestBody.new(
      widget_url: ::MxPlatformRuby::WidgetRequest.new(
        widget_type: 'connect_widget',
        is_mobile_webview: false,
        mode: 'verfication',
        ui_message_version: 4,
        # current_member_guid: member_guid,
      )
    )
    response = mx_platform_api.request_widget_url(user_guid, request_body)
    response.to_json
  rescue ::MxPlatformRuby::ApiError => e
    puts "Error when calling MxPlatformApi->request_connect_widget_url: #{e}"
    JSON.parse(err.response_body)
  end
end

get '/api/identity' do
  content_type :json
  begin
    # mx_platform_api.identify_member(member_guid, user_guid)
    # poll member status
    response = mx_platform_api.list_account_owners_by_member(member_guid, user_guid)
    response.to_json
  rescue ::MxPlatformRuby::ApiError => e
    puts "Error when calling MxPlatformApi->create_user: #{e}"
    JSON.parse(err.response_body)
  end
end

get '/api/balances' do
  content_type :json
  begin
    # mx_platform_api.check_balances(member_guid, user_guid)
    # poll member status
    response = mx_platform_api.list_user_accounts(user_guid)
    response.to_json
  rescue ::MxPlatformRuby::ApiError => e
    puts "Error when calling MxPlatformApi->create_user: #{e}"
    JSON.parse(err.response_body)
  end
end

get '/api/auth' do
  content_type :json
  begin
    # mx_platform_api.verify_member(member_guid, user_guid)
    # poll member status answer MFAs
    response = mx_platform_api.list_account_numbers_by_member(member_guid, user_guid)
    response.to_json
  rescue ::MxPlatformRuby::ApiError => e
    puts "Error when calling MxPlatformApi->create_user: #{e}"
    JSON.parse(err.response_body)
  end
end

get '/api/transactions' do
  content_type :json
  begin
    response = mx_platform_api.list_transactions_by_member(member_guid, user_guid)
    response.to_json
  rescue ::MxPlatformRuby::ApiError => e
    puts "Error when calling MxPlatformApi->list_transactions: #{e}"
    JSON.parse(err.response_body)
  end
end
