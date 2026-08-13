import os

def replace_in_file(filepath, replacements):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    for eng, fr in replacements.items():
        content = content.replace(eng, fr)
        
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

replace_in_file("src/pages/Dashboard.tsx", {
    "'Nom de l\\'événement'": "\"Nom de l'événement\""
})
