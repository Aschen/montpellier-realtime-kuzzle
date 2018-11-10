require 'i18n'
require 'json'
tramway_stops = JSON.parse(File.read('./data/tramway_stop_epured.json'))

rt_content = File.read('./data/TAM_MMM_TpsReel.csv').gsub(/\r/, '').split("\n").map { |e| e.split(';') }

json_rt_content = rt_content.reduce({}) do |acc, tab|
 acc.merge({
     stop_name: tab[3]
 })
end

puts json_rt_content