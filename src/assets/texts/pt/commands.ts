/* const dwiki = require("../../desciclopedia/dist");
const bolso = require("./bolsonaro.json");
module.exports = {
	async dwiki(callback, { argumentsTxt }) {
		let _response = RESPONSES.hidden;
		let callbackResponse = {};
		callbackResponse.type = "reply";
		if (argumentsTxt.length > 0) {
			try {
				let searchResults = await dwiki.search(argumentsTxt);
				let page = await dwiki.page(searchResults.results[0].pageid);
				let content = await page.content({
					redirect: false,
				});

				_response += content.replaceAll("\n", "\n\n");
				callbackResponse.response = _response;
				callback(callbackResponse);
			} catch (err) {
				callbackResponse.type = "error";
				callbackResponse.errorType = err;
				callbackResponse.response = RESPONSES.error.search;
				callback(callbackResponse);
			}
		}
	},
	async bolso(callback) {
		let quote = bolso[randomInt(bolso.length)];
		let _response = quote["formattedDate"];
		_response += "\n\n";
		_response += quote["text"];
		let callbackResponse = {
			type: "reply",
			response: _response,
		};
		callback(callbackResponse);
	},
};
 */
