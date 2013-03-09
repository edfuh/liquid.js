gem 'sprockets', '=1.0.2'

desc "Compiles from source scripts into dist/liquid.js"
task :build do
  puts "Building liquid.js..."

  require 'Sprockets'

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
