export function onRequest(context) {
  console.log('Route:', context.params.catchall)
  return new Response(JSON.stringify(context.params.catchall))
}
