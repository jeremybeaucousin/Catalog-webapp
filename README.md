# CatalogWebapp

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.3.12.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

> ng serve --configuration=fr --host 0.0.0.0 --disableHostCheck


## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).


## Add dependency
> ng add _____

## Add component
> ng generate component xyz

## Build for production
> ng build --prod --i18n-file src/locale/messages.fr.xlf --i18n-format xlf --i18n-locale fr
With configured langage
> ng build --prod --configuration=fr

whith base href
> ng build --prod --configuration=fr --bh /fr/

## Nginx
### Docker
Create container : 

> docker run --name catalog-webapp-nginx -v "C:\Users\a\DockerVolume\Catalog-webapp\nginx\conf\catalog-webapp.conf:/etc/nginx/conf.d/default.conf" -v "C:\Users\a\DockerVolume\Catalog-webapp\nginx\project\:/Catalog-webapp/" -p "4300:80" -d nginx

Example of configuration file :
```
server {
    add_header 'Access-Control-Allow-Origin' "*";
    add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS, DELETE, PUT';
    add_header 'Access-Control-Allow-Credentials' 'false';
    add_header 'Access-Control-Allow-Headers' '*';

    listen 80;
    server_name localhost;

    location /en/ {
        alias /Catalog-webapp/en/;
        try_files $uri $uri/ /en/index.html;
    }

    location /fr/ {
        alias /Catalog-webapp/fr/;
        try_files $uri $uri/ /fr/index.html;
    }

    # Default to FR
    location / {
        alias /Catalog-webapp/fr/;
        try_files $uri $uri/ /fr/index.html;
    }
}    
```