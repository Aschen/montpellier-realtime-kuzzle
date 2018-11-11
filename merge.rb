require 'fuzzy_match'
require 'json'

rt_course = JSON.parse(File.read('./rt-courses.json')).map { |k, v| v }
stops = JSON.parse(File.read('./stops.json'))

matcher = FuzzyMatch.new(rt_course, read: 'stopName')

stops = stops.keep_if do |stop| 
  stop['line'] != 5
end.map do |stop|
  matchs = matcher.find_all_with_score(stop['name'], threshold: 0.80)
 
  if matchs
    stop['matchName'] = ((stop['matchName'] || []) + matchs.map { |e| e[0]['stopName'] }).uniq
    stop['id'] = ((stop['id'] || []) + matchs.map { |e| e[0]['stopId'] }.keep_if { |e| e.size == 5 && e.start_with?('4') }).uniq
  end

  stop
end

File.write('stops.json', stops.to_json)