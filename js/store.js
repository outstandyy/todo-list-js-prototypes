;(function (context) {

	'use strict';

	var store = localStorage;

	function Store(key) {
		this.key = key;
		if (!store[key]) {
			store[key] = JSON.stringify([]);
		}
	}

	Store.fn = Store.prototype;

	/** Find item **/
	Store.fn.find = function (id, cb) {
		var items = getItems(this.key);
		var item = items.filter(function (item) {
			return id = item.id;
		});
		cb.call(this, item[0] || {});
	};

	/** Find all items **/
	Store.fn.findAll = function (cb) {
		cb.call(this, JSON.parse(store[this.key]));
	};

	/** Save item **/
	Store.fn.save = function (item, cb, options) {
		var items = getItems(this.key);

		// Update
		if (item.id) {
			items = items
			.map(function (x) {
				if (x.id === item.id) {
					for (var prop in item) {
						x[prop] = item[prop];
					}
				}
				return x;
			});
		} else {
			// Insert
			item.id = new Date().getTime();
			items.push(item);
		}

		store[this.key] = JSON.stringify(items);
		cb.call(this, item);
	};

	/** Delete item **/
	Store.fn.delete = function (id, cb) {
		var items = getItems(this.key);

		items = items
		.filter(function (x) {
			return x.id !== id;
		});

		store[this.key] = JSON.stringify(items);
		cb.call(this, true);
	};

	/** Delete all items **/
	Store.fn.deleteAll = function (id, cb) {
		store[this.key] = JSON.stringify([]);
		this.findAll(cb);
	};

	function getItems(key) {
		return JSON.parse(store[key]);
	}

	context.Store = Store;

})(this);
