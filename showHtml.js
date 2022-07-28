function sanitize(string) {
  const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      /*"'": '&#x27;',*/
      "/": '&#x2F;',
  };
  const reg = /[&<>"'/]/ig;
  return string.replace(reg, (match)=>(map[match]));
}

function createElement(etab_id,etab_name) {
  //<a href="showData.html?">etab_name</a>
  let href = "showData.html";
  let a = document.createElement("a");
  a.id = "etab_"+etab_id;
  a.innerHTML = sanitize(etab_name);
  a.href = href+"?i="+etab_id;
  
  //<div><a href="showData.html">etab_name</a></div
  let div = document.createElement("div");
  div.appendChild(a);

  //<span><div><a href="showData.html">etab_name</a></div></span>
  let span = document.createElement("span");
  span.appendChild(div);

  //<li><span><div><a href="showData.html">etab_name</a></div></span></li>
  let li = document.createElement("li");
  li.appendChild(span);

  return li;
}

function insertElement(parent_id,element){
  var parent = document.getElementById(parent_id);
  parent.insertBefore(element, parent.firstChild);
}
