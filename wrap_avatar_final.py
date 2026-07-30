c = open('recommend.html', 'r').read()

# The broken structure: </span>\n      <img class="dh-avatar" ...> (avatar outside badge)
# Fix: remove early </span>, add it after the <img>
c = c.replace(
    '</span>\n      <img class="dh-avatar" id="dhAvatarImg"',
    '\n      <img class="dh-avatar" id="dhAvatarImg"'
)
c = c.replace(
    'alt="头像">\n    <div class="dh-avatar-dropdown"',
    'alt="头像"></span>\n    <div class="dh-avatar-dropdown"'
)

open('recommend.html', 'w').write(c)
print('Fixed')