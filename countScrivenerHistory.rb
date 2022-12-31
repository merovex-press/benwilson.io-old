#!/Users/merovex/.rvm/rubies/ruby-3.1.2/bin/ruby
# frozen_string_literal: true

require 'date'
# require 'rubygems'
# require 'awesome_print'
require 'json'

TODAY = Date.today.to_s
json_file = '/Users/merovex/Code/merovex.com/data/wordcount/writingHistory.json'
text_file = '/Users/merovex/Code/merovex.com/today.log'

history = {}

def fnord; end

def parse_xml(file)
  File.readlines(file).map do |line|
    # <Day dwc="1877" dcc="10370" dtwc="6498" owc="0" occ="0" dtcc="35983" s="1250" st="w">2022-12-17</Day>
    # puts "line: #{line}"
    next unless line.include?('<Day')

    day = { date: line.match(%r{>(?<date>\d{4}-\d{2}-\d{2})</Day>})['date'] }
    m = line.match(/st="(?<st>\w+)"/)
    day[:st] = m.nil? ? 'w' : m['st']

    %i[dwc dcc dtwc owc occ dtcc s].each do |key|
      m = line.match(/#{key}="(?<#{key}>\d+)"/)
      day[key] = m.nil? ? 0 : m[key.to_s].to_i
    end
    day
  end.compact
end
def populate_hash(day)

end

def get_level(dwc, goal)
  goal = 1250 if goal.zero? || goal.nil?
  return 5 if dwc > goal

  (dwc.to_f / goal * 4).ceil
end

# Get all the 'writing.history' files in the Documents directory
files = Dir.glob('/Users/merovex/Documents/**/writing.history').map do |f|
  f unless f.include?('NOCOUNT')
end.compact

# puts 'Parsing Files'
files.each do |file|
  project = File.basename(file.gsub('Files/writing.history', '')).gsub('.scriv', '')

  parse_xml(file).each do |day|
    date = day[:date]
    adwc = (day.key?(:dcc) ? (day[:dcc] / 5) : 0)

    unless history.key?(date)
      history[date] = {
        totals: { dwc: 0, dcc: 0, adwc: 0, owc: 0, occ: 0, dtwc: 0, dtcc: 0, s: 0, st: 'w' }, level: 0
      }
    end
    next if history[date].key?(project)

    history[date][project] = {
      project: project,
      file: file,
      st: day[:st].to_s || 'w',
      adwc: adwc.to_i
    }
    %i[dwc dcc owc occ dtwc dtcc s].each do |key|
      history[date][project][key] = day.key?(key) ? day[key] : 0
    end
  end
end

# Total the writing history.
history.each_key do |date|
  last_project = nil
  history[date].each_key do |project|
    next if project.to_s == 'totals' || project.to_s == 'level'
    next if history[date].key?(last_project) && history[date][last_project][:dwc] == history[date][project][:dwc]

    %i[dwc dcc adwc owc occ dtwc dtcc].each do |key|
      history[date][:totals][key] += history[date][project][key] unless history[date][project][key].nil?
    end

    history[date][:totals][:s] = history[date][project][:s] || 1250
    history[date][:level] =
      get_level(history[date][:totals][:dwc], history[date][:totals][:s])

    last_project = project
  end
end

# Save the writing history to a file
# File.open(json_file, 'w').write(JSON.pretty_generate(history.sort.to_h))
File.open(json_file, 'w').write(JSON.generate(history.sort.to_h))
File.open(text_file, 'w').write(history[TODAY][:totals][:dwc].to_i)
puts (history.key?(TODAY)) ? history[TODAY][:totals][:dwc].to_i : 'N/A'