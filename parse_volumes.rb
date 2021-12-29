require 'json'
require 'yaml'
# require 'pp'
org = File.open("content/tools/terradoma-map/imperium-luctation.svg",'r').readlines.map do |line|
  next unless line.include? "<!-- Volume:"
  line
end.compact
# raise org.inspect
data = { "volumes" => {}}
def deconUwp(uwp)
  # [port,
  bits = uwp.split("")
  x = {port: bits.shift, size: bits.shift, atmo: bits.shift, h20: bits.shift, popx: bits.shift, govm: bits.shift, law: bits.shift, tek: bits.last}
  
  # raise x.inspect
end
org.each do |volume|
  volume.gsub!('<!-- ','')
  volume.gsub!(" -->\n",'')
  # puts volume
  raw = volume.split('//')
  # puts raw.inspect
  
  datum = { 
    name: raw.last.strip,
    location: raw.first.split(' ')[1],
    uwp: raw.first.split(' ')[2],
    temp: raw.first.split(' ')[3],
    bases: raw.first.split(' ')[4],
    travel_code: raw.first.split(' ')[5],
    trade_codes: raw[1],
    factions: raw[2],
    star: raw[3].strip.split(' ').first,
    details: deconUwp(raw.first.split(' ')[2]),
    orbits: raw[3].strip.split(' ').last
   }
   data['volumes'][raw.first.split(' ')[1]] = datum
end

# Add Orbit details

File.read("imperium.sector.txt").split("\n\n").each do |volume|
  key = volume.split("\n").first[0..3]
  if data['volumes'][key].nil?
    puts "You removed #{key}?"
    next
  end
  data['volumes'][key][:orbits] = []
  
  volume.split("\n").drop(1).each do |orbit|
    if orbit.include?("--") # is planet
      details = orbit.split("//").map{|i| i.strip()}
      details[0] = details[0][-1]
      details[1] = data['volumes'][key][:uwp] if details[0] == "W" # Force my update
      data['volumes'][key][:orbits] << [details, []]
    else # is moon
      data['volumes'][key][:orbits].last.last << orbit.gsub(/\s+\/\s+/,"")
    end
  end
end
File.open("content/tools/terradoma-map/terradoma-volume-data.json","w") do |f|
  f.write(data.to_json)
end
File.open("content/tools/terradoma-map/terradoma-volume-data.yaml","w") do |f|
  f.write(data.to_yaml)
end