require 'json'

stops = JSON.parse(File.read('./stops.json'))
coords = JSON.parse(File.read('./stops_api.json'))


coords.each do |coord|
  matchs = stops.keep_if { |e| e['name'] == coord['name'] }
  if matchs
    matchs.each do |match|
      match['coordinates'] = coord['coordinates']
    end
  else 
    puts coord
  end
end

File.write('stops.json', stops.to_json)
