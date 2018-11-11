require 'json'

content = JSON.parse(File.read('./stops_index.json'))

stops = content.map do |k, v|
  v
end.uniq do |el|
  el['name']
end

File.write('./stops.json', stops.to_json)
# stops = JSON.parse(File.read('./stops.json'))
# coords = JSON.parse(File.read('./stops_api.json'))

# coords.each do |coord|
#   matchs = stops.keep_if { |e| e['name'] == coord['name'] }

#   if matchs
#     matchs.each do |match|
#       match['coordinates'] = coord['coordinates']
#     end
#   end
# end

# File.write('stops.json', stops.to_json)
