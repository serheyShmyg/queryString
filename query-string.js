var qs = {
	/**
	 * Get query string from arg or search url or from hash, else false
	 * @param {String} argStr Some string which contain query string
	 * @exampl {String} '/TEST/JS/index.html#b?id=10&b=20'
	 * @returns {String} Query string
	 */
	get : function(argStr) {
		var str = argStr || window.location.search || window.location.hash,
			reg = /\?(.+)$/g,
			result;

		if (!str) return false;
		str = decodeURIComponent(str); //decode uri
		result = reg.exec(str);
		if (!result && str) return str;
		if (!result) return false;
		if (!result[1]) return false;
		return result[1];
	},
	/**
	 * Description
	 * @param {String} key Key we want to change
	 * @param {String} value Value we want to set
	 * @param {String} [str] Query string for parsing. If not exist try get from url
	 */
	set : function(key, value, str) {
		var result = this.parse(str || false);

		if (!key || !value || !result) return false;
		
		for (var objKey in result) {
			if (objKey === key) result[key] = value;
		}

		return this.toString(result);
	},
	/**
	 * Add some variables to current query string or to your own
	 * @param {Object|String} Query style string or simple js object
	 * @param {String} [query] Query style string
	 * @returns {String} New query string or false if some mistakes
	 */
	add : function(param, query) {
		if (!param) return false;
		var type = this.getType(param),
			currentQueryString = this.get(query),
			queryString;

		if (type === 'string') {
			queryString = param;
		} else if (type === 'object') {
			queryString = this.toString(param);
		} else {
			return false;
		}

		if (!currentQueryString) return false;

		return currentQueryString + '&' + queryString;
	},
	/**
	 * Change some key in query string by default or your own
	 * @param {String} key What key we want change
	 * @param {String|Number} newValue New value for key
	 * @param {String} [query] Query style string
	 * @returns {String} New query string or false if some mistakes
	 */
	change : function(newValues, query) {
		if (!newValues) return false;
		var converted = this.parse(query);

		if (!converted) return false;
		
		var oKey, oKey2;
		for (oKey in newValues) {
			for (oKey2 in converted) {
				if (oKey !== oKey2) continue;
				converted[oKey] = newValues[oKey];
			}
		}
		return this.toString(converted);
	},
	/**
	 * Description
	 * @obj {Object} Simple js object without nesting
	 * @isFirstSign {Boolean} Do we need first sign like ? or not
	 * @returns {String} Valid query string
	 */
	toString : function (o, isFirstSign) {
		var self = this,
			str = isFirstSign ? '?' : '',
			concat = '&',
			counter = 0,
			discardValue;
			setRecursion = function(obj) {
				if (self.getType(obj) !== 'object') return str;
				for (var key in obj) {
					discardValue = !obj[key] || self.getType(obj[key]) === 'array' || self.getType(obj[key]) === 'function';
					if ( self.getType(obj[key]) === 'object' ) {
						setRecursion(obj[key]);
						continue;
					}
					if (discardValue) continue;
					str += (counter ? concat : '') + key + '=' + obj[key];
					++counter;
				}
				return str;
			};
		if (!o) return false;
		setRecursion.call(this, o);
		return str;
	},
	/**
	 * Parse query string to plain js object
	 * @param {String} str
	 * @returns {Object} resultObj
	 */
	parse : function(str) {
		var result = this.get(str || false),
			resultObj = {},
			vars, pair;
		if (!result) return false;
		vars = result.split('&');
		if (!vars.length) return false;

		for (var n = 0, max = vars.length; n < max; n++) {
			pair = vars[n].split('=');
			resultObj[pair[0]] = pair[1];
		}
		return resultObj;
	},
	getType : function(value) {
		var Klass = Object.prototype.toString.call(value).slice(8, -1);

		if (value === null) return 'null';
		if (value === undefined) return 'undefined';

		return Klass.toLowerCase();
	}
};