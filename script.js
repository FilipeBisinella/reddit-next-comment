// ==UserScript==
// @name         Reddit next comment
// @version      2
// @description  Go to next reddit comment funcionalities
// @author       You
// @match        http*://www.reddit.com/r/*/comments/*
// @downloadURL  https://raw.githubusercontent.com/FilipeBisinella/reddit-next-comment/tampermonkey/script.js
// @updateURL    https://raw.githubusercontent.com/FilipeBisinella/reddit-next-comment/tampermonkey/script.js
// @grant        none
// ==/UserScript==


(function() {

'use strict';

var nodeList = document.querySelectorAll('.commentarea > .sitetable > .comment');

for (var i = 0; i < nodeList.length; i++) {
	var node = nodeList[i];
	preencher(node, i.toString());
}

var data = '0';
while (data.length > 0) {
	var selector = '[data-comment="' + data + '"]';
	var node = document.querySelector(selector);

	appendLinkProximo(node);
	// If not a top level comment, add link to go to next one level up and to go to top
	if (data.split('.').length > 1) {
		appendLinkProximo(node, 1);
		appendLinkProximo(node, 99);
	}
	data = findNextComment(data,-1,false);
}

function createLink(texto, funcao, title) {
	var link = document.createElement('a');
	link.href = 'javascript:void(0)';
	link.innerHTML = texto;
	if (funcao) {
		link.onclick = funcao;
	}
	if (title) {
		link.title = title;
	}
	return link;
}

function appendLink(node, link) {
	var span = document.createElement('span');
	var open = document.createTextNode('[');
	var close = document.createTextNode(']');

	span.appendChild(open);
	span.appendChild(link);
	span.appendChild(close);

	var p = node.querySelector('p.tagline');
	p.appendChild(span);
}

function createLinkProximo(node, up) {
	var data = node.getAttribute('data-comment');
	var funcao = function nextCommentWrap(data, original, up, nav) {
		return function() {nextComment(data, original, up, nav);};
	};

	var texto;

	var nav = true;
	if (up == 99) {
		texto = 'Top';
		nav = false;
	} else {
		texto = 'Proximo';
		if (up !== undefined) {
			texto += ' ' + up;
		}
	}

	var next = findNextComment(data, up ,nav);
	if (next === '') {
		next = 'nao existe';
	}
	var hint = data + ' > ' + next;
	var link = createLink(texto, funcao(data, '', up, nav), hint);

	return link;
}

function appendLinkProximo(node, up) {
	var link = createLinkProximo(node, up);
	appendLink(node, link);
}

// navigates to next comment
// nav defines if just goes up (false) or goes to next (true) [default]
function nextComment(data, original, up, nav) {
	if (!original) {
		original = data;
	}

	data = findNextComment(data,up,nav);

	var selector = '[data-comment="' + data + '"]';
	var node = document.querySelector(selector);

	// if next node does not exist
	if (!node){
		insertDiv('Não existe');
	} else {
		// if node is hidden, do not navigate (should never happen)
		if (node.style.display == 'none') {
			alert('hidden comment, run');
		} else {
			// scroll to next and show div with progress
			node.scrollIntoView();
			insertDiv(original + ' > ' + data);
		}
	}
}

// Finds the next comment data that = exists
function findNextComment(data, up, nav) {
	data = findNextData(data, up,nav);

	if (data.length > 0) {
		var selector = '[data-comment="' + data + '"]';
		var node = document.querySelector(selector);

		// if next node does not exist
		if (!node){
			//go up one and find next
			data = findNextComment(data,1,true);
		}
	} else {
		console.log('nao existe');	
	}

	return data;
}

// Finds the data comment in order, ignoring its existance
// up defines the number of levels to go up. if = 99, goes to top parent
// nav defines if just goes up (false) or goes to next (true) [default]
function findNextData(data, up, nav) {
	if (nav === undefined || nav === '') {
		nav = true;
	}

	// split data into array
	var split = data.split('.');

	if (up == 99) {
		// top parent is the first value in the array
		// remove all elements beyond first
		var remove = split.length - 1;
		split.splice(1,remove);
	} else {
		// if going down the thread
		if (up < 0) {
			for (var i=1;i<=-up;i++) {
				split.push(0);
			}
		} else {
			// remove last 'up' digits from array (same as going up 'up' nodes)
			split.splice(-up, up);
		}
	}

	if (nav) {
		if (split.length > 0) {
			// defines next comment to go to (adding 1 to last number of array)
			var next;
			next = parseInt(split[split.length-1],10);
			next++;
			
			// substitues last number in array with the next
			split.splice(-1, 1, next);
		}
	}
	data = split.join('.');
	return data;
}

function preencher(node, data) {
	node.setAttribute('data-comment', data);

	if (node.querySelector('.child').children.length > 0) {
		var childList = node.querySelectorAll(':scope > .child > .listing > .comment');
		for (var i = 0; i < childList.length; i++) {
			var child = childList[i];
			var dataChild = data+'.'+i;
			preencher(child, dataChild);
		}
	}
}

function createDiv(text) {
	var div = document.createElement('div');
	div.innerHTML = text;
	div.style.position = 'fixed';
	div.style.backgroundColor = '#EFDB07';
	div.style.zIndex = '999';
	div.style.bottom = '2px';
	div.style.left = '0';
	div.style.right = '0';
	div.style.marginLeft = 'auto';
	div.style.marginRight = 'auto';
	div.style.padding= '5px 0 5px 0';
	div.style.textAlign = 'center';
	div.style.width = '50%';
	div.style.borderWidth = '1px';
	div.style.borderStyle = 'solid';
	return div;
}

function insertDiv(text) {
	var div = createDiv(text);
	setTimeout(function(){div.parentNode.removeChild(div);}, 1500);
	document.body.appendChild(div);
}
})();