%W(bellicose-epub.jpg luctation-epub.jpg imbroglio-epub.jpg scintilla-epub.jpg ).each do |f|
  # puts f
  %W(png webp).each do |e|
    convert = "convert #{f} #{f.gsub('jpg',e)}"
    puts convert
  end
end
