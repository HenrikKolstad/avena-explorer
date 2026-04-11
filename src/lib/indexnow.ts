export async function pingIndexNow(urls: string[]) {
  const key = process.env.INDEXNOW_KEY || 'a7f3c291-8e4b-4d12-b5f6-3c9e1a2b0d8f';
  try {
    await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host: 'avenaterminal.com',
        key,
        keyLocation: `https://avenaterminal.com/${key}.txt`,
        urlList: urls,
      }),
    });
  } catch {}
}
