import { Env } from ".."
import { fetchRSS } from "./rss"



export const fetchSpiegel = async (env: Env) => {

    await fetchRSS(env.SPIEGEL_BUCKET, "https://www.spiegel.de/schlagzeilen/index.rss", "channel", "item")
}