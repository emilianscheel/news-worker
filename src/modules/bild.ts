import { Env } from ".."
import { fetchRSS } from "./rss"



export const fetchBild = async (env: Env, count: number) => {

    return await fetchRSS(env.BILD_BUCKET, "https://www.bild.de/rssfeeds/vw-alles/vw-alles-26970192,dzbildplus=false,sort=1,teaserbildmobil=false,view=rss2,wtmc=ob.feed.bild.xml", "channel", "item", count)
}