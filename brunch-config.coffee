exports.config =
  # See http://brunch.io/#documentation for docs.
  plugins:
    coffeelint:
      pattern: /^src\/.*\.coffee$/
      options:
        indentation:
          value: 2
          level: "error"

  files:
    javascripts:
      joinTo:
        'chaplin-utils.js': /^src/

  paths:
    public: './dist'
    watched: ['src']
