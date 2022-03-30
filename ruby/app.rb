# frozen_string_literal: true

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
# user_guid = 'USR-a236b5f9-5e4b-4520-949f-a64702de2aa7'
# member_guid = 'MBR-308badb0-2f71-438e-bfc6-3da976bf3655'
user_guid = nil
# user_guid = 'USR-7f418e14-bbac-4801-a8a2-f003c3e868d6'

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

get '/api/test' do
  { test: 'hit' }.to_json
end

get '/api/users' do
  content_type :json
  begin
    response = mx_platform_api.list_users
    response.to_hash.to_json
  rescue ::MxPlatformRuby::ApiError => error
    puts "Error when calling MxPlatformApi->list_users: #{error.message}"
    error.response_body
  end
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
        wait_for_full_aggregation: true,
        current_member_guid: data['current_member_guid']
      )
    )
    response = mx_platform_api.request_widget_url(user_guid, request_body)
    response.to_hash.to_json
  rescue ::MxPlatformRuby::ApiError => error
    puts "Error when calling MxPlatformApi->request_connect_widget_url: #{error.message}"
    [400, error.response_body]
  end
end

get '/api/identity/:member_guid' do
  content_type :json
  begin
    response = mx_platform_api.list_account_owners_by_member(params['member_guid'], user_guid)
    response.to_hash.to_json
  rescue ::MxPlatformRuby::ApiError => error
    puts "Error when calling MxPlatformApi->list_account_owners_by_member: #{error.message}"
    error.response_body
  end
end

post '/api/identity/:member_guid' do
  content_type :json
  begin
    response = mx_platform_api.identify_member(params[:member_guid], user_guid)
    response.to_hash.to_json
  rescue ::MxPlatformRuby::ApiError => error
    puts "Error when calling MxPlatformApi->identify_member: #{error.message}"
    error.response_body
  end
end

get '/api/balances' do
  content_type :json
  begin
    # mx_platform_api.check_balances(member_guid, user_guid)
    # poll member status
    response = mx_platform_api.list_user_accounts(user_guid)
    response.to_hash.to_json
  rescue ::MxPlatformRuby::ApiError => error
    puts "Error when calling MxPlatformApi->list_user_accounts: #{error.message}"
    error.response_body
  end
end

post '/api/balances' do
  content_type :json
  begin
    request.body.rewind # in case someone already read it
    data = JSON.parse(request.body.read)

    response = mx_platform_api.check_balances(data['member_guid'], data['user_guid'])
    response.to_hash.to_json
  rescue ::MxPlatformRuby::ApiError => error
    puts "Error when calling MxPlatformApi->check_balances: #{error.message}"
    error.response_body
  end
end

# Don't need this if widget runs in verification mode
get '/api/auth/:member_guid' do
  content_type :json
  begin
    # mx_platform_api.verify_member(member_guid, user_guid)
    # poll member status answer MFAs
    response = mx_platform_api.list_account_numbers_by_member(params['member_guid'], user_guid)
    response.to_hash.to_json
  rescue ::MxPlatformRuby::ApiError => error
    puts "Error when calling MxPlatformApi->list_account_numbers_by_member: #{error.message}"
    error.response_body
  end
end

get '/api/transactions/:member_guid' do
  content_type :json
  begin
    response = mx_platform_api.list_transactions_by_member(params['member_guid'], user_guid)
    response.to_hash.to_json
  rescue ::MxPlatformRuby::ApiError => error
    puts "Error when calling MxPlatformApi->list_transactions_by_member: #{error.message}"
    error.response_body
  end
end

get '/api/holdings' do
  content_type :json
  begin
    response = mx_platform_api.list_holdings(user_guid)
    response.to_hash.to_json
  rescue ::MxPlatformRuby::ApiError => error
    puts "Error when calling MxPlatformApi->list_holdings: #{error.message}"
    error.response_body
  end
end

post '/api/holdings' do
  content_type :json
  begin
    request.body.rewind  # in case someone already read it
    data = JSON.parse(request.body.read)

    response = mx_platform_api.aggregate_member(data['member_guid'], data['user_guid'])
    response.to_hash.to_json
  rescue ::MxPlatformRuby::ApiError => error
    puts "Error when calling MxPlatformApi->list_holdings: #{error.message}"
    error.response_body
  end
end

get '/api/:member_guid/status' do
  content_type :json
  begin
    response = mx_platform_api.read_member_status(params['member_guid'], user_guid)
    response.to_hash.to_json
  rescue ::MxPlatformRuby::ApiError => error
    puts "Error when calling MxPlatformApi->read_member_status: #{error.message}"
    error.response_body
  end
end
