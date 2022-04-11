# frozen_string_literal: true

require 'dotenv'
Dotenv.load('./../.env')

require 'httparty'
require 'colorize'

def test_config(mx_platform_api)
  unless ENV['CLIENT_ID'] && ENV['API_KEY']
    puts "\nOops! Make sure you change .env.example to .env and update the" \
        ' CLIENT_ID and API_KEY with your keys from' \
        " https://dashboard.mx.com/\n".colorize(:yellow)
    raise StandardError, '.env file not set up correctly'
  end

  if ENV['DEVELOPMENT_ENVIRONMENT'] == 'production'
    # Testing the configuration by attemting an api call to list_users
    begin
      response = mx_platform_api.list_users
      response.to_hash.to_json
    rescue ::MxPlatformRuby::ApiError => e
      case e.code
      when 401 # API KEYs or CLIENT_ID is wrong
        puts "\nMake sure the .env file has the production API_KEY and CLIENT_ID https://dashboard.mx.com/getting-started\n".yellow
        raise StandardError, 'Production keys missing or incorrect'
      when 403 # IP not whitelisted
        response = HTTParty.get('http://ip.jsontest.com/')
        ip = response['ip']
        puts "\nYou need to whitelist your IP address:".yellow,
             ip.to_s.magenta,
             "from the MX dashboard https://dashboard.mx.com/security\n".yellow

        raise StandardError, 'IP not whitelisted'
      end
    end
  end
end
