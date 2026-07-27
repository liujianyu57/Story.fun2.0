with open('recommend.html','r') as f: c=f.read()

# Template: use explicit colors, not currentColor
c = c.replace(
    "fill=\"${d.fav?'currentColor':'none'}\" stroke=\"${d.fav?'currentColor':'currentColor'}\"",
    "fill=\"${d.fav?'white':'none'}\" stroke=\"${d.fav?'none':'currentColor'}\""
)

# JS bookmarked: fill="white" stroke="none"
c = c.replace(
    "ic.innerHTML='<svg viewBox=\"0 0 24 24\" width=\"20\" height=\"20\" fill=\"white\">",
    "ic.innerHTML='<svg viewBox=\"0 0 24 24\" width=\"20\" height=\"20\" fill=\"white\" stroke=\"none\">"
)

# JS unbookmarked: fill="none" stroke="currentColor"
c = c.replace(
    "ic.innerHTML='<svg viewBox=\"0 0 24 24\" width=\"20\" height=\"20\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\">",
    "ic.innerHTML='<svg viewBox=\"0 0 24 24\" width=\"20\" height=\"20\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\">"
)

with open('recommend.html','w') as f: f.write(c)
print('bookmark v2: white icon on gold circle')
