require 'json'

stops = JSON.parse(File.read('./full_stops.json'))
puts stops

stops_obj = {}
stops.compact.each do |stop|
  # Keep only tram stops
  stop['ids'].each do |id|
    stops_obj[id] = {
      name: stop['name'],
      line: stop['line'],
      coordinates: stop['coordinates'],
      number: stop['number']
    }
  end
end

puts stops_obj.keys.size
File.write('stops_index.json', stops_obj.to_json)