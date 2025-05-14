/*
create table answer_log (
	id integer primary key,
	input text not null,
	time integer not null
) strict;
create table leaderboard (
	id integer primary key,
	answer_log_id integer not null references answer_log(id),
	name text not null,
	description text not null
) strict;
*/

async function hash(method, input) {
	return Array.from(new Uint8Array(await crypto.subtle.digest(method, new TextEncoder().encode(input))), b => ('0' + b.toString(16)).slice(-2)).join('')
}

export async function onRequest(context) {
	if (context.request.method !== 'GET') {
		return new Response('?', { status: 405 })
	}

	const { searchParams } = new URL(context.request.url)
	const input = searchParams.get('input')
	if (!input) {
		return new Response('input?', { status: 400 })
	}
	const inputHash = context.params.input
	if (hash(input) !== inputHash) {
		return new Response('input??', { status: 400 })
	}
	const response = await env.ASSETS.fetch(context.request)
	if (response.ok) {
		return new Response('114514')
	}
	return response
}
