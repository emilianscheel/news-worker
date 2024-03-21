/**
 * Welcome to Cloudflare Workers! This is your first scheduled worker.
 *
 * - Run `wrangler dev --local` in your terminal to start a development server
 * - Run `curl "http://localhost:8787/cdn-cgi/mf/scheduled"` to trigger the scheduled event
 * - Go back to the console to see what your worker has logged
 * - Update the Cron trigger in wrangler.toml (see https://developers.cloudflare.com/workers/wrangler/configuration/#triggers)
 * - Run `wrangler deploy --name my-worker` to deploy your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/runtime-apis/scheduled-event/
 */

import { fetchBild } from "./modules/bild";
import { fetchRBB24 } from "./modules/rbb24";
import { fetchSpiegel } from "./modules/spiegel";
import { fetchSZ } from "./modules/sz";
import { fetchTagesschau } from "./modules/tagesschau";
import { fetchZeit } from "./modules/zeit";



export interface Env {
    // Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
    // MY_KV_NAMESPACE: KVNamespace;
    //
    // Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
    // MY_DURABLE_OBJECT: DurableObjectNamespace;
    //
    // Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
    TAGESSCHAU_BUCKET: R2Bucket;
    SPIEGEL_BUCKET: R2Bucket;
    ZEIT_BUCKET: R2Bucket;
    BILD_BUCKET: R2Bucket;
    RBB24_BUCKET: R2Bucket;
    SZ_BUCKET: R2Bucket;
}

async function fetch(env: Env) {
    let count = 0
    count = await fetchTagesschau(env, count)
    count = await fetchSpiegel(env, count)
    count = await fetchZeit(env, count)
    count = await fetchSZ(env, count)
    count = await fetchBild(env, count)
    count = await fetchRBB24(env, count)
}

export default {
    async fetch(
        request: Request,
        env: Env,
    ): Promise<Response> {

        if (request.url.includes("/trigger")) {
            await fetch(env)
            return new Response("Triggered")
        }

        const tagesschau = await env.TAGESSCHAU_BUCKET.list()
        const spiegel = await env.SPIEGEL_BUCKET.list()
        const zeit = await env.ZEIT_BUCKET.list()
        const sz = await env.SZ_BUCKET.list()
        const bild = await env.BILD_BUCKET.list()
        const rbb24 = await env.RBB24_BUCKET.list()

        const objects = [...tagesschau.objects, ...spiegel.objects, ...zeit.objects, ...sz.objects, ...bild.objects, ...rbb24.objects]

        const html = `<!DOCTYPE html>
		<body>
		  <h1>News Worker Analytics</h1>
		  <p>This markup was generated by a Cloudflare Worker.</p>

          <!-- List of Tagesschau  -->

          <ul>
            <li>
                <h3>${tagesschau.objects.length} Tagesschau Artikel (${tagesschau.objects.reduce((prev, item) => prev + item.size, 0) / 1000} Mb)</h3>
            </li>
            <li>
                <h3>${spiegel.objects.length} Spiegel Artikel (${spiegel.objects.reduce((prev, item) => prev + item.size, 0) / 1000} Mb)</h3>
            </li>
            <li>
                <h3>${zeit.objects.length} Zeit Online Artikel (${zeit.objects.reduce((prev, item) => prev + item.size, 0) / 1000} Mb)</h3>
            </li>
            <li>
                <h3>${sz.objects.length} Süddeutsche Zeitung Artikel (${sz.objects.reduce((prev, item) => prev + item.size, 0) / 1000} Mb)</h3>
            </li>
            <li>
                <h3>${bild.objects.length} Bild Artikel (${bild.objects.reduce((prev, item) => prev + item.size, 0) / 1000} Mb)</h3>
            </li>
            <li>
                <h3>${rbb24.objects.length} RBB24 Artikel (${rbb24.objects.reduce((prev, item) => prev + item.size, 0) / 1000} Mb)</h3>
            </li>
          </ul>

          <hr/>

          <h3>Insgesamt ${objects.length} Artikel (${objects.reduce((prev, item) => prev + item.size, 0) / 1000} Mb)</h3>

		</body>`;

        return new Response(html, {
            headers: {
                "content-type": "text/html;charset=UTF-8",
            },
        })
    },

    async scheduled(
        controller: ScheduledController,
        env: Env,
        ctx: ExecutionContext
    ): Promise<void> {

        let count = 0

        count = await fetchTagesschau(env, count)
        count = await fetchSpiegel(env, count)
        count = await fetchZeit(env, count)
        count = await fetchSZ(env, count)
        count = await fetchBild(env, count)
        count = await fetchRBB24(env, count)
    }
};
