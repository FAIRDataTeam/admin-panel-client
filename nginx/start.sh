#!/bin/sh

# create config
APP_TITLE=${APP_TITLE:-FDP Admin Panel}
config=/usr/share/nginx/html/config.js
echo -n "window.config={apiUrl:'"$API_URL"',title:'"$APP_TITLE"'};" > ${config}

# regenerate styles if there are any customizations
if [[ $(find /src/scss/custom -name "*.scss" | xargs cat | wc -c) -gt 0 ]]; then
  find /usr/share/nginx/html/css -name "*.css" -exec sassc -I /src -t compressed /src/scss/main.scss {} \;
fi

nginx -g 'daemon off;'
