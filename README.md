

# Simfinity Web
> Get the webcomponents for a simfinity API

```html
<simfinity-web url=""></simfinity-web>
```
You should provide to the web component the url of the API

# Getting starged

## Pre-requisites
Yarn: https://yarnpkg.com/

## How do I run it?
Just install dependencies with `yarn` and then run `yarn start`.

## Where the data is comming from?
This project is pulling the GraphQL schema and data from https://multiscreen-techgroup.rj.r.appspot.com/graphql, which is a deployment of the [Series Sample](https://github.com/simtlix/series-sample).  
This is configured in `public/index.html`, so if you want to use another GraphQL schema and data just update the url indicated in `<simfinity-web>`, like so:
```html
  <simfinity-web url="http://localhost:3000/graphql"></simfinity-web>
```
