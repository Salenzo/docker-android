export async function fetch(request, env) {
  const url = new URL(request.url)
  if (url.pathname.startsWith('/pages/')) {
    return env.ASSETS.fetch(request)
  }
  return env.hello.fetch(request)
}
