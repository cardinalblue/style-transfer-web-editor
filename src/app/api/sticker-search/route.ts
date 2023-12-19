import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const limit = searchParams.get('limit') ?? 30
  const query = searchParams.get('query') ?? ''

  if (query === '') {
    return Response.json({ data: [] })
  }

  const result = await fetch(
    `https://content.piccollage.com/api/v2/stickers?limit=${limit}&query=${encodeURIComponent(
      query
    )}`,
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
