import { Env } from ".."
import { fetchRSS } from "./rss"



export const fetchSZ = async (env: Env) => {

    await fetchRSS(env.SZ_BUCKET, "https://rss.sueddeutsche.de/alles", "channel", "item")
}