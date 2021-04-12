require 'FileUtils'
posts = Dir.glob("content/post/*.m*")
# puts posts.inspect
posts.each do |post|
  dirname = post.sub('post','posts').split('.').first
  new_file = "#{dirname}/index.md"
  FileUtils.mkdir_p(dirname)
  FileUtils.copy_file(post, new_file) unless File.exist? new_file
  contents = File.read(post)
  image_source = contents.match(/image: (.*?)\n/).captures.first
  img_file = "static/assets/images/articles/#{image_source}"
  if File.exist?(img_file)
    new_image = "#{dirname}/#{File.basename(img_file)}"
    FileUtils.copy(img_file, new_image) unless File.exist? new_image
  else
    puts "Problem: #{dirname}, no image (#{img_file})"
  end
  # raise [img_file, new_image, File.exist?(img_file)].inspect
end