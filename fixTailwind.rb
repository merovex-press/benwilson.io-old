#!/Users/merovex/.rvm/rubies/ruby-3.1.2/bin/ruby

# Find all CSS files in static/css

Dir["./themes/hugo-merovex-2021/assets/**/*.css"].each do |file|
  contents = File.read(file)
    .gsub(/dark:\s/, "dark:")
    .gsub(/print:\s/, "print:")
    .gsub(/focus:\s/, "focus:")
    .gsub(/hover:\s/, "hover:")
    .gsub(/active:\s/, "active:")
    .gsub(/md:\s/, "md:")
    .gsub(/lg:\s/, "lg:")
    .gsub(/xl:\s/, "xl:")
    .gsub(/sm:\s/, "sm:")
  puts contents
  exit
end
