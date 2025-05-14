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

export function onRequest(context) {
	if (context.request.method !== 'GET') {
		return new Response('?', { status: 405 })
	}

	context.request.headers.get('X-')
	return new Response(context.params.input)
}
