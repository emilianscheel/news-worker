import { Env } from ".."
import { fetchRSS } from "./rss"



export const fetchRBB24 = async (env: Env, count: number) => {

    return await fetchRSS(env.RBB24_BUCKET, "https://www.rbb24.de/aktuell/index.xml/feed=rss.xml", "channel", "item", count)
}