require 'json'

stops = JSON.parse(File.read('./stops.json'))
stops_api = JSON.parse(File.read('./stops_api.json'))

result = stops_api.map do |stop|
  info = stops.detect {|e| e['name'] == stop['name'] }

  if info 
    lat, lng = stop['coordinates'].split(',').map {|e| e.to_f}
    {
      name: stop['name'],
      line: stop['line'],
      coordinates: {
        lat: lat,
        lng: lng
      },
      number: stop['number'],
      ids: info['id'].map { |e| e.to_i }
    }  
  else
    puts stop['name']
  end
end

File.write('full_stops.json', result.to_json)