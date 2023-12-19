import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const limit = searchParams.get('limit') ?? 30
  const offset = searchParams.get('offset') ?? 0

  const result = await fetch(
    `https://content.piccollage.com/api/v2/sticker_bundles?country_code=US&limit=${limit}&offset=${offset}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )

  if (result.status === 200) {
    const data = await result.json()
    return Response.json(data)
  } else {
    throw Error(result.statusText)
  }
}
