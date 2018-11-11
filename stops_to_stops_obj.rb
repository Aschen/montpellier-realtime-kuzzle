require 'json'

stops = JSON.parse(File.read('./stops.json'))

stops_obj = {}

stops.each do |stop|
  # Keep only tram stops
  stop['id'] = stop['id'].keep_if { |e| e.size == 5 && e.start_with?('4') }
  stop['id'].each do |id|
    stops_obj[id] = stop
  end
end

puts stops_obj.keys.size
File.write('stops_index.json', stops_obj.to_json)