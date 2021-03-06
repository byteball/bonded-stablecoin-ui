// yarn global add i18next-parser
// run i18next

// en-template.json is autogenerated, do not edit

module.exports = {
	lexers: {
		js: [{
			lexer: 'JsxLexer'
		}],
	},
	verbose: false,
	locales: ['en'],
	input: ['../**/*.js'],
	output: '$LOCALE-template.json',
}
