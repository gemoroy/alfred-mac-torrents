'use strict';
const alfy 	= require('alfy');
const query = alfy.input;

alfy.fetch(`http://mac-torrents.com/wp-json/wp/v2/posts?orderby=relevance&search=${query}`).then(data =>{
	var exp = new RegExp(query, 'i');
	data = data.filter(function (item) {
		if (exp.test(item.title.rendered)) {
			return item;
		}
	})

	const items = data.map(x => ({
		title: x.title.rendered,
		arg: x.id
	}));

	var ids = data.map(x => {
		return x.id
	})

	alfy.fetch(`http://mac-torrents.com/wp-json/wp/v2/media?parent=${ids.toString()}`).then(data =>{
		for (var i = 0; i < ids.length; i++) {
			var tmp = data.filter(item => {
				if (item.post === ids[i] && item.media_type === 'file') {
					items[i].arg = item.source_url;
				}
			})
		}
		alfy.output(items)
	})
});
