canvas.style.width = canvas_width;
canvas.style.height = canvas_height;
let resized = resizeCanvasToDisplaySize(canvas);

var yyyy = date.getFullYear();
dateSelector.min = yyyy+'-'+mm_min+'-'+dd_min;
dateSelector.max = yyyy+'-'+mm_max+'-'+dd_max;

function displayRank(d,m){
	let n = countDays(parseInt(dd_min),parseInt(mm_min),d,m);
	let rank = "";
	if (points != null && points.length>0){
		for (let i=0; i<points.length; i++){
			if (points[i][0] == n){
				rank = points[i][1];
				break;
			}
		}
	}
	document.getElementById("rank").value = rank;
}

function goToToday(){
	let today = date.toLocaleDateString('en-CA');
	let parts = today.split('-');
	if (parts[0] != yyyy || !checkDate(parts[2],parts[1])){
		dateSelector.value = yyyy+'-'+mm_min+'-'+dd_min;
		dd_selected = dd_min;
		mm_selected = mm_min;
		date_selected_is_valid = false;
	}else{
		dateSelector.value = today;
		dd_selected = parts[2];
		mm_selected = parts[1];
		date_selected_is_valid = true;
	}
	displayRank(parseInt(dd_selected),parseInt(mm_selected));
	updateCanvas(-1,-1);
}

goToToday();
updateCanvas(-1,-1);

function goToPrevDate(){
	let new_day = parseInt(dd_selected,10);
	if (new_day <= 1){
		let new_month = 1+(parseInt(mm_selected,10)+10)%12;
		new_day = daysPerMonth(new_month);
		if (checkDate(new_day,new_month)){
			date_selected_is_valid = true;
			dd_selected = new_day.toString();
			mm_selected = new_month.toString();
	        if (new_month < 10){
	            mm_selected = "0"+mm_selected;
	        }
	    }
	}else{
		new_day--;
		let new_month = parseInt(mm_selected,10);
		if (checkDate(new_day,new_month)){
			date_selected_is_valid = true;
			dd_selected = new_day.toString();
			if (new_day < 10){
				dd_selected = "0"+dd_selected;
	        }
		}
	}
	if (date_selected_is_valid){
		dateSelector.value = yyyy+'-'+mm_selected+'-'+dd_selected;
	}
	displayRank(parseInt(dd_selected),parseInt(mm_selected));
	updateCanvas(-1,-1);
}

function goToNextDate(){
	let new_day = parseInt(dd_selected,10);
	let new_month = parseInt(mm_selected,10);
	if (new_day >= daysPerMonth(new_month)){
		new_day = 1
		new_month = new_month%12 + 1;
		if (checkDate(new_day,new_month)){
			date_selected_is_valid = true;
			dd_selected = "01";
			mm_selected = new_month.toString();
	        if (new_month < 10){
	            mm_selected = "0"+mm_selected;
	        }
	    }
	}else{
		new_day++;
		if (checkDate(new_day,new_month)){
			date_selected_is_valid = true;
			dd_selected = new_day.toString();
			if (new_day < 10){
				dd_selected = "0"+dd_selected;
	        }
		}
	}
	if (date_selected_is_valid){
		dateSelector.value = yyyy+'-'+mm_selected+'-'+dd_selected;
	}
	displayRank(parseInt(dd_selected),parseInt(mm_selected));
	updateCanvas(-1,-1);
}

function checkChange(){
	let new_date = dateSelector.value;
	let parts = new_date.split('-');
	dd_selected = parts[2].toString();
	let day = parseInt(dd_selected);
	mm_selected = parts[1].toString();
	let month = parseInt(mm_selected);
	date_selected_is_valid = checkDate(day,month);
	if (date_selected_is_valid){
		displayRank(parseInt(dd_selected),parseInt(mm_selected));
	}
	updateCanvas(-1,-1);
}

let selectToday = document.getElementById('selectToday');
selectToday.onclick = goToToday;

let prevDate = document.getElementById('prevDate');
prevDate.onclick = goToPrevDate;

let nextDate = document.getElementById('nextDate');
nextDate.onclick = goToNextDate;

dateSelector.onchange = checkChange;
