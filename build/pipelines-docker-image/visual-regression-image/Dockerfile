FROM atlassianlabs/atlaskit-mk-2:1.0.11

# Install Chromium and Puppeteer
RUN apt-get update && apt-get install -yq gconf-service libasound2  libatk-bridge2.0-0 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 \
  libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 \
  libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 \
  libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 \
  ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget unzip && \
  wget https://github.com/Yelp/dumb-init/releases/download/v1.2.1/dumb-init_1.2.1_amd64.deb && \
  dpkg -i dumb-init_*.deb && rm -f dumb-init_*.deb && \
  apt-get clean && apt-get autoremove -y && rm -rf /var/lib/apt/lists/*
  
RUN yarn global add puppeteer@1.13.0

# Install Open Sans font
# (manually until the apt-get fonts-open-sans package is promoted from unstable to stable)
RUN wget https://fonts.google.com/download?family=Open%20Sans -O open-sans-font.zip -t 3 && \
  unzip open-sans-font.zip -d ./font && \
  find ./font -type f -exec chmod 644 {} \; && \
  mv ./font/* /usr/local/share/fonts && \
  rm -r ./font && rm open-sans-font.zip && \
  fc-cache -fv
