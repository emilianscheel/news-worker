# News Worker


```sh
wrangler deploy --name tagesschau-worker --var enabled:tagesschau

wrangler deploy --name spiegel-worker --var enabled:spiegel

wrangler deploy --name zeit-worker --var enabled:zeit

wrangler deploy --name sz-worker --var enabled:sz

wrangler deploy --name bild-worker --var enabled:bild

wrangler deploy --name rbb24-worker --var enabled:rbb24
```