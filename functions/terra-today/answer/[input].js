/*
create table answer_log (
	id integer primary key,
	input text not null,
	time text not null default current_timestamp
) strict;
create table leaderboard (
	id integer primary key,
	answer_log_id integer not null references answer_log(id),
	name text not null,
	time text not null default current_timestamp,
	description text not null
) strict;
*/

const sha256 = async input => Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input))), b => ('0' + b.toString(16)).slice(-2)).join('')

export async function onRequest(context) {
	try {
		if (context.request.url.length > 1919) {
			return new Response('😾', { status: 414 })
		}
		const url = new URL(context.request.url)
		if (context.request.method === 'GET') {
			// GET /.../answer/<hash>?input=<string> = check answer
			const input = url.searchParams.get('input')
			if (!input) {
				return new Response('input?', { status: 400 })
			}
			if (context.params.input !== await sha256(`
嘟嘟嘟 嘟嘟嘟
Work work work work
Work work work work
Work work work work
勤劳又勇敢的血狼破军
为了团队的关键刷铁机
他做出了巨大的贡献
巨大的牺牲
巨大的carry
无敌了 无敌了
相信武魂真身！
全军出击！我咬死你！
Wooooo
牙崩了…牙崩了…
Wooooo
牙崩了吗？牙崩了吗？！
卧槽我们狗神！
Wooooo
我即是天选，也是唯一！
无敌了 无敌了
${input}
勤劳又勇敢的血狼破军
为冠军厨的关键蓟县屋
他做出了巨大的贡献
巨大的牺牲
巨大的carry
无敌了 无敌了
相信武魂真身！
全军出击！我咬死你！
Wooooo
牙崩了…牙崩了…
Wooooo
牙崩了吗？牙崩了吗？！
我敲我们狗神！
Wooooo
我即是天选，也是VE！
无敌了 无敌了`)) {
				return new Response('input!?', { status: 400 })
			}
			const { results: [{ id }] } = await context.env.answer_log.prepare(
				'insert into answer_log (input) values (?) returning id'
			).bind(input).run()
			const response = await context.env.ASSETS.fetch(context.request)
			if (!response.ok) {
				return response
			}
			return new Response(`${url.pathname}-register?${new URLSearchParams({
				id,
				key: await sha256(context.env.KEY + id + context.env.KEY),
			})}`)
		} else if (context.request.method === 'POST') {
			// POST /.../answer/<whatever>?id=<id>key=<key>
			// name=<name>&description=<description>
			// = add leaderboard entry
			context.request.body
			const id = url.searchParams.get('id')
			if (!id) {
				return new Response('id?', { status: 400 })
			}
			if (!/^\d{1,10}$/.test(id)) {
				return new Response('id!?', { status: 400 })
			}
			const key = url.searchParams.get('key')
			if (!key) {
				return new Response('key?', { status: 400 })
			}
			if (key !== await sha256(context.env.KEY + id + context.env.KEY)) {
				return new Response('key!?', { status: 403 })
			}
			let form
			try {
				form = context.request.formData()
			} catch {
				return new Response('form?', { status: 400 })
			}
			const name = form.get('name') ?? ''
			const description = form.get('description') ?? ''
			if (name.length > 1919 || description.length > 1919) {
				return new Response('😾', { status: 413 })
			}
			const { results: [{ id: rank }] } = await context.env.answer_log.prepare(
				'insert into leaderboard (answer_log_id, name, description) values (?, ?, ?)'
			).bind(+id, name, description).run()
			return new Response(rank.toString())
		} else {
			return new Response('?', { status: 405 })
		}
	} catch (error) {
		return new Response(error.stack, { status: 500 })
	}
}
