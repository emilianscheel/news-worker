import { Env } from ".."



export type TagesschauItem = {
    sophoraId: string
    title: string
    copyright: string
    type: "video" | "story"
    date: string
    tags: { tag: string }[]
    details?: string
    detailsweb?: string
    shareURL: string
}

/* Response from https://www.tagesschau.de/api2u/news */
export type TagesschauResponse = {
    news: TagesschauItem[]
    type: 'news page'
}



export const fetchTagesschau = async (env: Env, count: number): Promise<number> => {

    let newCount = count

    if (newCount > 45) return newCount

    const tagesschauApi = "https://www.tagesschau.de/api2/news/"

    const response = await fetch(tagesschauApi, { method: "GET" })
    const json = await response.json() as TagesschauResponse
    newCount += 1;

    for (const news of json.news) {

        const object = await env.TAGESSCHAU_BUCKET.get(news.sophoraId)

        if (object != null) continue

        // Tagesschau Video (Only less than metadata)
        if (news.type == "video") {
            await env.TAGESSCHAU_BUCKET.put(news.sophoraId, JSON.stringify(news))
        }

        if (newCount > 45) return newCount

        // Tagesschau News Story (More metadata, including content)
        // https://www.tagesschau.de/api2u/inland/regional/badenwuerttemberg/swr-wolf-im-kreis-konstanz-gesichtet-100.json
        if (news.details) {
            const response = await fetch(news.details, { method: "GET" })
            const details = await response.json()
            await env.TAGESSCHAU_BUCKET.put(news.sophoraId, JSON.stringify(details))
            newCount += 1;
        }
    }

    return newCount
}