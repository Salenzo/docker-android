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
	description text not null
) strict;

await crypto.subtle.exportKey('jwk', await crypto.subtle.generateKey({
	name: 'HMAC',
	hash: 'SHA-256',
}, true, ['sign', 'verify']))
*/

const sha256 = async input => Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input))), b => ('0' + b.toString(16)).slice(-2)).join('')

export async function onRequest(context) {
	try {
		if (context.request.method !== 'GET') {
			return new Response('?', { status: 405 })
		}
		if (context.request.url.length > 1919) {
			return new Response('😾', { status: 414 })
		}
		const { searchParams } = new URL(context.request.url)
		const input = searchParams.get('input')
		if (!input) {
			return new Response('input?', { status: 400 })
		}
		if (context.params.input !== await sha256(`嘟嘟嘟 嘟嘟嘟
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
		const resp = await context.env.answer_log.prepare(
			'insert into answer_log (input) values (?) returning id'
		).bind(input).run()
		if (resp) return Response.json(resp)
		const response = await context.env.ASSETS.fetch(context.request)
		if (!response.ok) {
			return response
		}
		const key = await crypto.subtle.importKey('jwk', JSON.parse(context.env.HMAC_KEY), {
			name: 'HMAC',
			hash: 'SHA-256',
		}, false, ['sign'])
		await crypto.subtle.sign('HMAC', key, new Int32Array([]))
		return new Response('114514')
	} catch (error) {
		return new Response(error.stack, { status: 500 })
	}
}
