require 'yaml'
require 'fileutils'

def find_md_files(directory)
  Dir.glob(File.join(directory, '*.md'))
end

def parse_md_file(file)
  frontmatter, content = File.read(file).split('---', 3).reject(&:empty?)

  begin
    yaml_data = YAML.safe_load(frontmatter)
  rescue => e
    puts "Error parsing YAML in file '#{file}': #{e.message}"
    return
  end

  {
    frontmatter: yaml_data,
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

def process_files(directory)
  files = find_md_files(directory)
  new_directory = File.expand_path('parsed', File.dirname(directory))

  files.each do |file|
    parsed_data = parse_md_file(file)
    next if parsed_data.nil?

    new_filename = "#{File.basename(directory)}.md"
    save_new_file(parsed_data, new_directory, new_filename)
  end
end

directory = './posts/' # Change this to the directory containing the '*.md' files
process_files(directory)
