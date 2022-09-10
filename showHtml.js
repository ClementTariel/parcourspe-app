function sanitize(string) {
  const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      /*"'": '&#x27;',*/"'": "'",
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
  span.className = "etabname";

  //<li><span><div><a href="showData.html">etab_name</a></div></span></li>
  let li = document.createElement("li");
  li.appendChild(span);

  //<a onclick="alert(1);return false;" href=""> &nbsp;X&nbsp; </a>
  a = document.createElement("a");
  a.setAttribute("onclick", "if(confirm('Supprimer toutes les données relatives à \""+sanitize(etab_name).replace("'", "\\\'")+"\" ?')){if(window.is_using_electron){window.api.send('delEtab',"+sanitize(etab_id.toString())+");}else{delEtab("+sanitize(etab_id.toString())+");}}");
  a.id = "delete_etab_"+etab_id;
  a.innerHTML = "&nbsp;X&nbsp;";
  a.href = "index.html";

  //<span id="plus"><a onclick="alert(1);return false;" href=""> &nbsp;X&nbsp; </a></span>
  span = document.createElement("span");
  span.appendChild(a);
  span.id = "cross_"+etab_id;
  span.className = "cross";

  li.appendChild(span);

  return li;
}

function insertElement(parent_id,element){
  var parent = document.getElementById(parent_id);
  parent.insertBefore(element, parent.firstChild);
}
