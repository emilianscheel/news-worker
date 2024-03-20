import { Env } from ".."
import { fetchRSS } from "./rss"



export const fetchZeit = async (env: Env) => {

    await fetchRSS(env.ZEIT_BUCKET, "https://newsfeed.zeit.de/news/index", "channel", "item")
}