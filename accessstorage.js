if (!window.is_using_electron){
	if (typeof(Storage) === "undefined") {
		alert("error storage unavailable");
	}

	function getPoints(etab_id){
		let data = JSON.parse(window.localStorage.getItem('data')); 
		if (data == null){
			data = {};
			window.localStorage.setItem('data',JSON.stringify(data));
		}
		if (etab_id=="NaN" || !data.hasOwnProperty(etab_id.toString())){
			return null;
		}
		return {"name":data[etab_id.toString()]["name"],"points": data[etab_id.toString()]["points"]};
	}

	function addRank(etab_id, point){
		let data = JSON.parse(window.localStorage.getItem('data')); 
		if (data == null || !data.hasOwnProperty(etab_id.toString())){
			return;
		}
		let points = data[etab_id.toString()]["points"];
		let ndays = point[0];
		let rank = point[1];
		let i=0;
		if (points.length>0){
			for (i=0; i<points.length; i++){
				if (points[i][0] > ndays){
					if (points[i][1] > rank){
						return;
					}
					break;
				}else if(points[i][0] == ndays){
					if (!((i+1<points.length && points[i+1][1] > rank)
					||(i>0 && points[i-1][1] < rank))){
						points[i][1] = rank;
						data[etab_id.toString()]["points"] = points;
						window.localStorage.setItem('data',JSON.stringify(data));
					}
					return;
				}
			}
			if (i>0 && points[i-1][1] < rank){
				return;
			}
		}
		points.splice(i, 0, [ndays,rank]);
		data[etab_id.toString()]["points"] = points;
		window.localStorage.setItem('data',JSON.stringify(data));
	}

	function deletePoint(etab_id, ndays){
		let data = JSON.parse(window.localStorage.getItem('data')); 
		if (data == null || !data.hasOwnProperty(etab_id.toString())){
			return;
		}
		let points = data[etab_id.toString()]["points"];
		for (let i=0; i<points.length; i++){
			if (points[i][0] == ndays){
				points.splice(i, 1);
				data[etab_id.toString()]["points"] = points;
				window.localStorage.setItem('data',JSON.stringify(data));
				return;
			} 
		}
	}

	function setEtabs(){
		let data = JSON.parse(window.localStorage.getItem('data')); 
		if (data == null){
			data = {};
			window.localStorage.setItem('data',JSON.stringify(data));
		}
		let etabs = [];
		let keys = Object.keys(data);
		for (let i=0; i<keys.length; i++){
			let key = keys[i];
			etabs.push([key,data[key]['name']]);
		}
		if(etabs != null && etabs.length>0){
		    for (let i=0; i<etabs.length; i++){
				let etab = etabs[i];
				let etab_id = etab[0];
				let etab_name = etab[1];
				insertElement("etabList",createElement(etab_id,etab_name));
			}
		}
	}

	function addEtab(etab_name){
		if (etab_name.replace(/\s/g, '').length > 0){
			let data = JSON.parse(window.localStorage.getItem('data')); 
			if (data == null){
				data = {};
				window.localStorage.setItem('data',JSON.stringify(data));
			}
			let etab_id = 0;
			while (data.hasOwnProperty(etab_id.toString())){
				etab_id++;
			}
			data[etab_id.toString()] = {"name": etab_name, "points": []};
			window.localStorage.setItem('data',JSON.stringify(data));
			return etab_id;
		}else{
			return -1;
		}
	}

	function delEtab(etab_id){
		let data = JSON.parse(window.localStorage.getItem('data')); 
		if (data == null){
			data = {};
			window.localStorage.setItem('data',JSON.stringify(data));
		}
		if(data.hasOwnProperty(etab_id.toString())){
			delete data[etab_id.toString()];
			window.localStorage.setItem('data',JSON.stringify(data));
		}
	}

	function changeEtabName(etab_id,etab_name){
		let data = JSON.parse(window.localStorage.getItem('data')); 
		if (data == null){
			data = {};
			window.localStorage.setItem('data',JSON.stringify(data));
			return;
		}
		if (etab_name.replace(/\s/g, '').length > 0){
			data[etab_id.toString()]["name"] = etab_name;
			window.localStorage.setItem('data',JSON.stringify(data));
		}
	}

	if (typeof window.etabsUnset !== "undefined" && window.etabsUnset){
		setEtabs();
	}
}