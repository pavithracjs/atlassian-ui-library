- Removed CardView and CardViewLoader from public APIs and replaced it with light-weight and stateless CardLoading and CardError components. Handling of external images is now done by Card component itself using ExternalImageIdentifier interface.

If you’ve been using CardView for loading:

```js
<CardView
  status="loading"
  mediaItemType="file"
  dimensions={cardDimensions}
/>
```

Now you can use new component:

```js
<CardLoading dimensions={cardDimensions} />
```

If you were using CardView to show an error

```js
<CardView
  status="error"
  mediaItemType={type}
  dimensions={cardDimensions}
/>
```

Now you can use new component:

```js
<CardError dimensions={cardDimensions} />
```

In case you were using CardView to show image with known external URI:

```js
<CardView
  status="complete"
  dataURI={dataURI}
  metadata={metadata}
/>
```

You will have to find a way to switch to using Card component using ExternalImageIdentifier interface:

```js
<Card
  identifier={identifier}
  context={context}
/>
```