require 'json'

stops = JSON.parse(File.read('./data/tramway_stops.json'))

stops_obj = {}
stops.compact.each do |stop|
  # Keep only tram stops
  stop['ids'].each do |id|
    stops_obj[id] = stop
  end
end

puts stops_obj.keys.size
File.write('stops_index.json', stops_obj.to_json)