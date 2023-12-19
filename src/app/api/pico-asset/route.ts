import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest, response: NextResponse) {
  const searchParams = request.nextUrl.searchParams
  const url = searchParams.get('url')
  if (!url) {
    throw Error('url is required')
  }

  const result = await fetch(url as string)
  const buffer = await result.arrayBuffer()
  console.log('## url', url)
  console.log('## buffer', buffer)

  const base64 = Buffer.from(buffer).toString('base64')
  const dataUrl = `data:${result.headers.get('content-type')};base64,${base64}`
  console.log('## base64', base64)
  console.log('## dataUrl', dataUrl)

  if (result.status === 200) {
    return Response.json({ dataUrl })
  } else {
    throw Error(result.statusText)
  }
}
