require 'yaml'
require 'fileutils'

def find_md_files(directory)
  Dir.glob(File.join(directory, '**/*.md'))
end

def parse_md_file(file)
  frontmatter, content = File.read(file).split('---', 3).reject(&:empty?)

  begin
    yaml_data = YAML.safe_load(frontmatter, permitted_classes: [Time])
  rescue => e
    puts "Error parsing YAML in file '#{file}': #{e.message}"
    return
  end

  allowed_keys = %w[aliases date title summary description]
  filtered_data = yaml_data.select { |key, _| allowed_keys.include?(key) }
  filtered_data['description'] ||= filtered_data.delete('summary')

  {
    frontmatter: filtered_data,
    content: content.strip
  }
end


def save_new_file(parsed_data, new_directory, new_filename)
  FileUtils.mkdir_p(new_directory)
  File.open(File.join(new_directory, new_filename), 'w') do |f|
    f.puts '---'
    f.puts parsed_data[:frontmatter].to_yaml
    f.puts '---'
    f.puts parsed_data[:content]
  end
end

# def process_files(directory)
#   files = find_md_files(directory)
#   new_directory = File.expand_path('parsed', File.dirname(directory))

#   files.each do |file|
#     puts file.inspect
    
#     parsed_data = parse_md_file(file)
#     next if parsed_data.nil?

#     new_filename = "#{File.basename(directory)}.md"
#     # puts "Saving file '#{new_filename}' to '#{new_directory}'"
#     # exit
#     save_new_file(parsed_data, new_directory, new_filename)
#   end
# end
def process_files(directory)
  files = find_md_files(directory)
  new_directory = File.expand_path('posts', File.dirname(directory))

  files.each do |file|
    next if file.include?("_index.md")
    parsed_data = parse_md_file(file)
    next if parsed_data.nil?

    parent_dir_name = File.basename(File.dirname(file))
    new_filename = "#{parent_dir_name}.md"
    save_new_file(parsed_data, new_directory, new_filename)
  end
end


directory = './2023_old_posts/' # Change this to the directory containing the '*.md' files
process_files(directory)
