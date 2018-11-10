require 'json'

content = JSON.parse(File.read("./data/tramway_line.json"))

tramway_lines = content["Folder"]["Placemark"].map do |value|
    # puts value.keys
    # puts value["MultiGeometry"]["LineString"][0]["coordinates"].split(' ').map {|e| e.split(',')}
    # exit
    {
        name: value["name"],
        geo_lines: value["MultiGeometry"]["LineString"].map do |line|
            if line.is_a?(Array)
                line[1].split(' ').map { |c| c.split(',')}
            else
                line["coordinates"].split(' ').map { |c| c.split(',')}
            end
        end
    }
end

puts tramway_lines

File.write('./data/tramway_lines_epured.json', tramway_lines.to_json)

