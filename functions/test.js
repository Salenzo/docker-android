const sha256 = async input => Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input))), b => ('0' + b.toString(16)).slice(-2)).join('')

export async function onRequest(context) {
	return new Response(await sha256(context.request.url))
}
