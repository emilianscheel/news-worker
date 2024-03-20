import { XMLParser } from 'fast-xml-parser';


const options = {
    ignoreAttributes: false
}

const parser = new XMLParser(options);





export const fetchRSS = async (bucket: R2Bucket, url: string, type1: "feed" | "channel", type2: "item" | "entry") => {

    const request = await fetch(url, { method: "GET" })

    const xmlData = await request.text()
    const data = parser.parse(xmlData)
    const feed = data.rss[type1]

    for (const item of feed[type2]) {

        if (!item.link) continue

        const object = await bucket.get(item.link)

        if (object != null) continue

        // Save the actual content
        const response = await fetch(item.link, { method: "GET" })
        await bucket.put(`html-of-${item.link}`, JSON.stringify(response.body))

        // Save the metadata
        await bucket.put(`meta-of-${item.link}`, JSON.stringify(item))
    }

}