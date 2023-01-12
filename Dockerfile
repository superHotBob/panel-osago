FROM node:13 as client
WORKDIR /app
COPY package.json package-lock.json /app/
RUN npm ci
COPY ./ /app/
RUN npm run build

RUN cd ./dist/main \
    && > osago-loader.template.js \
    && (for f in src*.css; do echo "document.write('<link rel="stylesheet" href=\"//\$DEPLOYMENT_DOMAIN/$f\">');" >> osago-loader.template.js; done;) \
    && (for f in src*.js; do echo "document.write('<script src=\"//\$DEPLOYMENT_DOMAIN/$f\"></script>');" >> osago-loader.template.js; done;)

RUN npm run build-partner-widget
RUN cd ./dist/partner \
    && > partner-loader.template.js \
    && CSS_FILE=$(find . -name "*.css" | sed -e "s/^\.\///g") \
    && JS_FILE=$(find . -name "*widget*.js" | sed -e "s/^\.\///g") \
    && echo '!function(e,t,n,r,a,s,c){var u=document.createElement("link");if(u.href="'"//\$DEPLOYMENT_DOMAIN/$CSS_FILE"'",u.type="text/css",u.rel="stylesheet",document.getElementsByTagName("head")[0].appendChild(u),e[a]=e[a]||function(){e[a].queue=e[a].queue||[],e[a].queue.push(arguments)},!t.querySelector(n+'"'"'[src="'"'"'+r+'"'"'"]'"'"')){s=t.createElement(n),c=t.getElementsByTagName(n)[0],s.async=1,s.src=r;var i=function(){c.parentNode.insertBefore(s,c)};"[object Opera]"==e.opera?d.addEventListener("DOMContentLoaded",i,!1):i()}}(window,document,"script","'"//\$DEPLOYMENT_DOMAIN/$JS_FILE"'","mustins");' >> partner-loader.template.js

FROM nginx:1.19
COPY --from=client /app/dist/main /usr/share/nginx/html
COPY --from=client /app/dist/partner /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY entrypoint.sh /docker-entrypoint.d/entrypoint.sh
RUN chmod +x /docker-entrypoint.d/entrypoint.sh
ENV DEPLOYMENT_DOMAIN site.com
EXPOSE 80
