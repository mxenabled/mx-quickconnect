FROM ruby:2.7.5-slim
WORKDIR /app
COPY ./ruby/Gemfile /app
COPY ./ruby/Gemfile.lock /app
RUN gem install bundler -v 2.3.5 && \
  bundle install
COPY ./ruby .
EXPOSE 8000
CMD ["ruby","app.rb", "-o", "0.0.0.0"]
