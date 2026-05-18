import re
path = r"d:\Coding\Amantra\amantra-packaging-website-updated\_portfolio-block.html"
with open(path, encoding="utf-8") as f:
    s = f.read()
# fix corrupted motion tags from bad generation
s = s.replace("<motion>", "___OPEN___").replace("</motion>", "___CLOSE___")
# restore structure with a stack parser - simpler: rebuild from scratch
