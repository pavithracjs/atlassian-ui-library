# Analytics

Related reading:

- <https://atlaskit.atlassian.com/packages/core/analytics-next/docs/concepts>
- <https://atlaskit.atlassian.com/packages/core/analytics>

_This step is not mandatory. If you don't have access for these steps, you can add the analytics integration in our components and check output in your dev tools console._

## How run Atlaskit website with Analytics platform

Many of our components support analytics out of the box. These components create analytics events and hand them to you. This puts you in control of firing, listening and recording these events in which ever way you like.

In order to enable developers to validate the analytics flow easily via Atlaskit website (on developer mode only) using the Chrome Plugin "[Atlassian - Analytics Dev Panel](https://chrome.google.com/webstore/detail/atlassian-analytics-dev-p/pkgdebooadcbggdeihcmionebjnfhjcf)", improving the dev-experience and avoiding regression issues with our analytics platform.

Install this plugin is required, so that you can easily validate and track Atlassian client side analytics. After installing, restart your Chrome browser. Open the dev tools and there should be a new tab called "Analytics".

Now you should install the required package globally. Keep in mind this is a private package and your should required access to download that. Since you have the proper access, install the package globally by running the command:

```
yarn global add @atlassiansox/analytics-web-client
```

After that, link the package in website folder located in Atlaskit repository.

```
# access your global package and create the link using yarn
cd "\$(yarn global dir)/node_modules/@atlassiansox/analytics-web-client" && yarn link
# now move back to your atlaskit repository, access the folder `website`
# and link the folder with the required package
cd <your-atlaskit-folder>/website && yarn link "@atlassiansox/analytics-web-client"
```

Then, go back to the root folder of Atlaskit repository, rerun the website again passing 'ENABLE_ANALYTICS_GASV3=true' environment variable as a prefix for your command.

```
cd <your-atlaskit-folder> # access your atlaskit repository locally
ENABLE_ANALYTICS_GASV3=true bolt <your-command> # run your command locally
```
