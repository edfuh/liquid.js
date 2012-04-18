gem 'sprockets', '=1.0.2'

desc "Test javascript in Adobe AIR... Required AIR SDK"
task :test_air do
  puts `adl test-app.xml`
end

desc "Test javascript in Rhino... Requires Java"
task :test do
  # Yeah, doesn't really work right yet
  puts "Not working yet. But you can open test/liquid-tests.html in your browser..."
  puts `java -jar test/env/js.jar test/env/test.harness.js`
end

desc "Compiles from source scripts into dist/liquid.js"
task :build do
  puts "Building liquid.js..."
  begin
    require 'Sprockets'
  rescue LoadError
    puts "Build require sprockets:"
    puts
    puts "  gem install sprockets"
    puts
    exit(1)
  end
  
  secretary = Sprockets::Secretary.new(
    :asset_root   => "assets",
    :load_path    => ["source", "etc", "."],
    :source_files => ["source/core.js"],
    :strip_comments => true
  )

  # Generate a Sprockets::Concatenation object from the source files
  concatenation = secretary.concatenation
  # Write the concatenation to disk
  Dir.mkdir('dist') unless File.exists?('dist')
  concatenation.save_to("dist/liquid.js")

  puts "Piping liquid.js through yuicompressor..."
  `java -jar bin/yuicompressor-2.4.6.jar -o dist/liquid.min.js dist/liquid.js`

  puts 'Done.'
end

task :default => :build
