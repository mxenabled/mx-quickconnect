FROM ruby:2.7.5-slim
RUN apt -qq update && \
  apt -y install git --no-install-recommends
WORKDIR /app
COPY Gemfile /app
COPY Gemfile.lock /app
RUN gem install bundler -v 2.3.5 && \
  bundle install
COPY . .
