require 'json'
org = File.open("static/assets/images/imperium-luctation.svg",'r').readlines.map do |line|
  next unless line.include? "<!-- Volume:"
  line
end.compact
# raise org.inspect
data = { "volumes" => {}}
def deconUwp(uwp)
  # [port,
  bits = uwp.split("")
  x = {port: bits.shift,
  size: bits.shift,
  atmo: bits.shift,
  h20: bits.shift,
  popx: bits.shift,
  govm: bits.shift,
  law: bits.shift,
  tek: bits.shift}
  
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
    orbits: raw[3].strip.split(' ').last,
    details: deconUwp(raw.first.split(' ')[2])
   }
   data['volumes'][raw.first.split(' ')[1]] = datum
  # pp datum
  # exit
end
puts data.to_json