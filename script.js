// javascript:(function()%20{var%20nodeList%20=%20document.querySelectorAll(%22.commentarea%20%3E%20.sitetable%20%3E%20.comment%22);for%20(var%20i%20=%200;%20i%20%3C%20nodeList.length;%20i%2B%2B)%20{var%20node%20=%20nodeList[i];node.setAttribute(%22data-comment%22%2C%20i);preencher(node%2C%20i);appendLinkProximo(node);var%20childList%20=%20node.querySelectorAll(%22.comment%22);for%20(var%20j%20=%200;%20j%20%3C%20childList.length;%20j%2B%2B)%20{var%20child%20=%20childList[j];appendLinkProximo(child);appendLinkProximo(child%2C%201);}}function%20createLink(texto%2C%20funcao)%20{var%20link%20=%20document.createElement(%27a%27);link.href%20=%20%22javascript%3Avoid(0)%22;link.innerHTML%20=%20texto;if%20(funcao)%20{link.onclick%20=%20funcao;}return%20link;}function%20appendLink(node%2C%20link)%20{var%20p%20=%20node.querySelector(%22p.tagline%22);p.appendChild(link);}function%20createLinkProximo(node%2C%20up)%20{var%20data%20=%20node.getAttribute(%22data-comment%22);var%20funcao%20=%20function%20nextCommentWrap(i%2C%20original%2C%20up)%20{return%20function()%20{nextComment(i%2C%20original%2C%20up);};};var%20link%20=%20createLink(%22proximo%22%2C%20funcao(data%2C%20%22%22%2C%20up));return%20link;}function%20appendLinkProximo(node%2C%20up)%20{var%20link%20=%20createLinkProximo(node%2C%20up);appendLink(node%2C%20link);}function%20nextComment(data%2C%20original%2C%20up)%20{if%20(!original)%20{original%20=%20data;}console.log(%22atual%3A%20%22%20%2B%20data);data%20=%20findNextComment(data%2C%20up);console.log(%22proximo%3A%20%22%20%2B%20data);var%20selector%20=%20%27[data-comment=%22%27%20%2B%20data%20%2B%20%27%22]%27;var%20node%20=%20document.querySelector(selector);if%20(!node){console.log(%22nao%20existe%22);if%20(data.length%20%3E%200)%20{nextComment(data%2C%20original%2C%201);}%20else%20{insertDiv(%22N%C3%A3o%20existe%22);}}%20else%20{if%20(node.style.display%20==%20%27none%27)%20{nextComment(data%2C%20original);}%20else%20{node.scrollIntoView();insertDiv(original%20%2B%20%22%20%3E%20%22%20%2B%20data);}}}function%20findNextComment(data%2C%20up%2C%20nav)%20{if%20(nav%20===%20undefined)%20{nav%20=%20true;}var%20split%20=%20data.split(%22.%22);if%20(up%20==%20-1)%20{split%20=%20split[0];}%20else%20{split.splice(-up%2C%20up);}var%20next;if%20(nav)%20{if%20(split.length%20%3E%200)%20{next%20=%20parseInt(split[split.length-1]%2C10);next%2B%2B;split.splice(-1%2C%201%2C%20next);}}data%20=%20split.join(%22.%22);return%20data;}function%20preencher(node%2C%20data)%20{var%20childList%20=%20node.querySelectorAll(%22%3Ascope%20%3E%20.child%20%3E%20.listing%20%3E%20.comment%22);for%20(var%20i%20=%200;%20i%20%3C%20childList.length;%20i%2B%2B)%20{var%20child%20=%20childList[i];var%20dataChild%20=%20data%2B%22.%22%2Bi;if%20(!child)%20{alert(i);alert(data);alert(dataChild);}child.setAttribute(%22data-comment%22%2C%20dataChild);if%20(child.querySelector(%22.child%22).children.length%20%3E%200)%20{preencher(child%2C%20dataChild);}}}function%20createDiv(text)%20{var%20div%20=%20document.createElement(%22div%22);div.innerHTML%20=%20text;div.style.position%20=%20%22fixed%22;div.style.backgroundColor%20=%20%22%23EFDB07%22;div.style.zIndex%20=%20%22999%22;div.style.bottom%20=%20%222px%22;div.style.left%20=%20%220%22;div.style.right%20=%20%220%22;div.style.marginLeft%20=%20%22auto%22;div.style.marginRight%20=%20%22auto%22;div.style.padding=%20%225px%200%205px%200%22;div.style.textAlign%20=%20%22center%22;div.style.width%20=%20%2250%25%22;div.style.borderWidth%20=%20%221px%22;div.style.borderStyle%20=%20%22solid%22;return%20div;}function%20insertDiv(text)%20{var%20div%20=%20createDiv(text);document.body.appendChild(div);removeDiv%20=%20function(div)%20{div.parentNode.removeChild(div);};div.addEventListener(%22click%22%2C%20removeDiv.bind(null%2C%20div));setTimeout(removeDiv(div)%2C%201500);}})()
(function() {
var nodeList = document.querySelectorAll(".commentarea > .sitetable > .comment");
for (var i = 0; i < nodeList.length; i++) {
	var node = nodeList[i];
	node.setAttribute("data-comment", i);
	preencher(node, i);
	appendLinkProximo(node);

	var childList = node.querySelectorAll(".comment");
	for (var j = 0; j < childList.length; j++) {
		var child = childList[j];
		appendLinkProximo(child);
		appendLinkProximo(child, 1);
	}
}

function createLink(texto, funcao) {
	var link = document.createElement('a');
	link.href = "javascript:void(0)";
	link.innerHTML = texto;
	if (funcao) {
		link.onclick = funcao;
	}
	return link;
}

function appendLink(node, link) {
	var p = node.querySelector("p.tagline");
	p.appendChild(link);
}

function createLinkProximo(node, up) {
	var data = node.getAttribute("data-comment");
	var funcao = function nextCommentWrap(i, original, up) {
		return function() {nextComment(i, original, up);};
	};

	var link = createLink("proximo", funcao(data, "", up));
	return link;
}

function appendLinkProximo(node, up) {
	var link = createLinkProximo(node, up);
	appendLink(node, link);
}

function nextComment(data, original, up) {
	if (!original) {
		original = data;
	}
	console.log("atual: " + data);
	data = findNextComment(data, up);
	console.log("proximo: " + data);
	var selector = '[data-comment="' + data + '"]';
	var node = document.querySelector(selector);
	// if next node does not exist
	if (!node){
		console.log("nao existe");
		//go up one and find next, unless is already at top of thread
		if (data.length > 0) {
			nextComment(data, original, 1);
		} else {
			insertDiv("Não existe");
		}
	} else {
		// if node is hidden, do not navigate (should never happen)
		if (node.style.display == 'none') {
			nextComment(data, original);
		} else {
			// scroll to next and show div with progress
			node.scrollIntoView();
			insertDiv(original + " > " + data);
		}
	}
}

// up defines the number of levels to go up. if = -1, goes to top parent
// nav defines if just goes up (false) or goes to next (true) [default]
function findNextComment(data, up, nav) {
	if (nav === undefined) {
		nav = true;
	}
	// split data into array
	var split = data.split(".");

	if (up == -1) {
		// top parent is the first value in the array
		split = split[0];
	} else {
		// remove last 'up' digits from array
		split.splice(-up, up);
	}
	var next;
	if (nav) {
		if (split.length > 0) {
			// defines next comment to go to (adding 1 to last number of array)
			next = parseInt(split[split.length-1],10);
			next++;
			// substitues last number in array with the next
			split.splice(-1, 1, next);
		}
	}
	data = split.join(".");
	return data;
}

function preencher(node, data) {
	var childList = node.querySelectorAll(":scope > .child > .listing > .comment");
	for (var i = 0; i < childList.length; i++) {
		var child = childList[i];
		var dataChild = data+"."+i;
		if (!child) {
			alert(i);
			alert(data);
			alert(dataChild);
		}
		child.setAttribute("data-comment", dataChild);
		if (child.querySelector(".child").children.length > 0) {
			preencher(child, dataChild);
		}
	}
}

function createDiv(text) {
	var div = document.createElement("div");
	div.innerHTML = text;
	div.style.position = "fixed";
	div.style.backgroundColor = "#EFDB07";
	div.style.zIndex = "999";
	div.style.bottom = "2px";
	div.style.left = "0";
	div.style.right = "0";
	div.style.marginLeft = "auto";
	div.style.marginRight = "auto";
	div.style.padding= "5px 0 5px 0";
	div.style.textAlign = "center";
	div.style.width = "50%";
	div.style.borderWidth = "1px";
	div.style.borderStyle = "solid";
	return div;
}

function insertDiv(text) {
	var div = createDiv(text);
	document.body.appendChild(div);
	removeDiv = function(div) {div.parentNode.removeChild(div);};
	div.addEventListener("click", removeDiv.bind(null, div));
	setTimeout(removeDiv(div), 1500);
}
})()