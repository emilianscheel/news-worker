import { XMLParser } from 'fast-xml-parser';


const options = {
    ignoreAttributes: false
}

const parser = new XMLParser(options);





export const fetchRSS = async (bucket: R2Bucket, url: string, type1: "feed" | "channel", type2: "item" | "entry", count: number): Promise<number> => {

    let newCount = count

    if (newCount > 45) return newCount

    const request = await fetch(url, { method: "GET" })
    const xmlData = await request.text()
    const data = parser.parse(xmlData)
    const feed = data.rss[type1]
    newCount += 1

    for (const item of feed[type2]) {

        if (!item.link) continue

        const object = await bucket.get(item.link)

        if (object != null) continue

        const objectId = item.link
            .replace("/", "-")
            .replace(":", "-")
            .replace("?", "-")
            .replace("=", "-")
            .replace("&", "-")
            .replace("https", "")
            .replace("http", "")
            .replace("www.", "")

        // Save the metadata
        await bucket.put(`meta-of-${objectId}`, JSON.stringify(item))

        if (newCount > 45) return newCount

        // Save the actual content
        const response = await fetch(item.link, { method: "GET" })
        const html = await response.text()
        newCount += 1
        await bucket.put(`html-of-${objectId}`, html)
    }


    return newCount
}