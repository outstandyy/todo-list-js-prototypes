;(function (context) {

	'use strict';

	var ENTER_KEY = 13;
	var ESC_KEY = 27;

	function App(lsKey) {
		this.Store = new Store(lsKey);
		this.currentId = 0;
		this.initDOM();
		this.addEventListeners();
		this.render();
	}

	App.fn = App.prototype;

	App.fn.addEventListeners = function () {
		$.on(this.$insert, 'keypress', this.onInsert.bind(this));
		$.delegate(this.$list, '.toggle', 'click', this.onToggle.bind(this));
		$.delegate(this.$list, '.destroy', 'click', this.onDelete.bind(this));
		$.on(this.$clearCompleted, 'click', this.onClearCompleted.bind(this));
		// Filter
		$.delegate(this.$filters, '.button', 'click', this.onFilter.bind(this));
		// Edit
		$.delegate(this.$list, 'span', 'dblclick', this.onStartEditing.bind(this));
		$.delegate(this.$list, '.edit', 'keyup', this.onEditingCancel.bind(this));
		$.delegate(this.$list, '.edit', 'keydown', this.onEditingDone.bind(this));
		$.delegate(this.$list, '.edit', 'blur', this.onEditingLeave.bind(this));
	};

	// Render
	App.fn.render = function () {
		var filter = this.filter();
		this.Store.findAll(function (items) {
			if (filter) {
				items = items
				.filter(function (item) {
					return item.completed === (filter === 'completed');
				});
			}
			var nodes = this.getNodeItemMulti(items);
			this.$list.innerHTML = '';
			this.$list.appendChild(nodes);
			this.showControls();

		}.bind(this));

	};

	// Editing
	App.fn.onStartEditing = function (event) {
		var li = $.parent(event.target, 'li');
		var element = $('.edit', li);
		this.currentId = parseInt(li.dataset.id, 10);
		li.className += ' editing';
		element.value = event.target.innerHTML;
		element.focus();
	};

	App.fn.onEditingCancel = function (event) {
		if (event.keyCode === ESC_KEY) {
			console.log('onEditingCancel', event.target);
			event.target.dataset.isCanceled = true;
			event.target.blur();
		}
	};

	App.fn.onEditingDone = function (event) {
		if (event.keyCode === ENTER_KEY) {
			event.target.blur();
		}
	};

	App.fn.onEditingLeave = function (event) {
		console.log('onEditingLeave');
		var input = event.target;
		var id = this.getItemId(input);
		var text = input.value.trim();
		var li = this.getElementByDataId(id);
		if (input.value.trim()) {
			var item = {
				id: id,
				text: text
			};
			this.Store.save(item, this.endEditing.bind(this, li, text));
		} else {
			if (input.dataset.isCanceled) {
				this.endEditing(li);
			} else {
				this.delete(id);
			}
		}
	};

	App.fn.endEditing = function (li, text) {
		li.className = li.className.replace('editing', '');
		$('.edit', li).removeAttribute('data-is-canceled');
		if (text) {
			$('span', li).innerHTML = text;
		}
	};

	App.fn.getItemId = function (element) {
		var li = $.parent(element, 'li');
		return parseInt(li.dataset.id, 10);
	};

	App.fn.getElementByDataId = function (id) {
		return $('[data-id="' + id + '"]');
	};

	App.fn.onInsert = function (event) {
		var element = event.target;
		var text = element.value.trim();
		if (text && event.keyCode === ENTER_KEY) {
			this.insert(text);
			element.value = '';
		}
	};

	// Filter
	App.fn.onFilter = function (event) {
		document.location.hash = event.target.getAttribute('href');
		this.render();
	};

	App.fn.filter = function () {
		var hash = document.location.hash;
		if (!hash) return false;
		$.qsa('.button', this.$filters)
		.each(function (button) {
			if (button.getAttribute('href') === hash) {
				button.className = 'button selected';
			} else {
				button.className = button.className.replace('selected', '');
			}
		});
		hash = hash.split('#/')[1];
		return hash !== 'all' ? hash : false;
	};

	// Toggle
	App.fn.onToggleAll = function (event) {
		var checked = event.target.checked;
		var self = this;

		this.Store.findAll(function (items) {
			$.each(items, function (item) {
				item.completed = checked;
				self.store.save(item, $.noop);
			});
			self.render();
		});
	};

	App.fn.onToggle = function (event) {
		var element = event.target;
		var id = this.getItemId(element);
		var item = {
			id: id,
			completed: element.checked
		};
		this.Store.save(item, function (item) {
			var li = this.getElementByDataId(item.id);
			li.className = item.completed ? 'completed' : '';
			$('.toggle', li).checked = item.completed;
			this.showControls();
		}.bind(this));
	};

	// Delete
	App.fn.onDelete = function (event) {
		var id = this.getItemId(event.target);
		this.delete(id);
	};

	App.fn.delete = function (id) {
		this.Store.delete(id, function () {
			var li = this.getElementByDataId(id);
			this.$list.removeChild(li);
			this.showControls();
		}.bind(this));
	};

	App.fn.onClearCompleted = function (event) {
		var self = this;
		this.Store.findAll(function (items) {
			items = items
			.filter(function (item) {
				return item.completed;
			})
			.forEach(function (item) {
				self.delete(item.id);
			});
		});
	};

	// Insert
	App.fn.insert = function (text) {
		var item = {
			text: text,
			completed: false
		};
		this.Store.save(item, function (item) {
			var element = this.getNodeItem(item);
			this.$list.appendChild(element);
			this.showControls();
		}.bind(this));
	};

	App.fn.showControls = function () {
		this.Store.findAll(function (items) {
			this.showBarAndToggleAll(items);
			this.showTotalTasksLeft(items);
			this.showClearCompleted(items);
		}.bind(this));
	};

	App.fn.showBarAndToggleAll = function (items) {
		var total = items.length;
		var completed = items.filter(function (item) {
			return item.completed;
		});
		var value = total ? 'block' : 'none';
		this.$toggleAll.style.display = value;
		this.$toggleAll.checked = total === completed.length;
		this.$bar.style.display = value;
	};

	App.fn.showTotalTasksLeft = function (items) {
		items = items
		.filter(function (item) {
			return !item.completed;
		});
		// var len = items.length;
		// var text = [len, ' item', $.pluralize(len), ' left'].join('');
		this.$total.innerHTML = items.length;
	};

	App.fn.showClearCompleted = function (items) {
		var some = items
		.some(function (item) {
			return item.completed;
		});
		this.$clearCompleted.style.display = some ? 'inline-block' : 'none';
	};

	App.fn.getNodeItem = function (item) {
		var li = document.createElement('li');
		var div = document.createElement('div');
		var toggle = document.createElement('input');
		var span = document.createElement('span');
		var destroy = document.createElement('button');
		var edit = document.createElement('input');

		li.setAttribute('data-id', item.id);

		if (item.completed) {
			li.className = 'completed';
		}

		div.className = 'todo';

		toggle.setAttribute('type', 'checkbox');
		toggle.className = 'toggle';
		toggle.checked = item.completed;

		span.appendChild(document.createTextNode(item.text));

		destroy.className = 'destroy';

		edit.setAttribute('type', 'text');
		edit.className = 'edit';

		div.appendChild(toggle);
		div.appendChild(span);
		div.appendChild(destroy);

		li.appendChild(div);
		li.appendChild(edit);

		return li;
	};

	App.fn.getNodeItemMulti = function (items) {
		var fragment = document.createDocumentFragment();
		$.each(items, function (item) {
			fragment.appendChild(this.getNodeItem(item));
		}.bind(this));
		return fragment;
	};

	App.fn.initDOM = function () {
		this.$insert = $('#js-insert');
		this.$toggleAll = $('#js-toggle-all');
		this.$bar = $('#js-bar');
		this.$list = $('#js-list');
		this.$clearCompleted = $('#js-clear-completed');
		this.$total = $('#js-total');
		this.$filters = $('#js-filters');
	};

	// Initialization on Dom Ready
	window.addEventListener('DOMContentLoaded', function () {
		var app = new App('todo');
	});

})(this);
