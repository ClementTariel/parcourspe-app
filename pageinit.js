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

function updatePredictedValue(){
	if (points == null || points.length == 0 || error || alpha == null || beta == null || unSurTau == null){
        return;
    }
	let t_0_min = inverse_f1(alpha,beta,unSurTau,0.5);
	let t_0_max = inverse_f1(alpha,beta,unSurTau,-0.5);
	let prediction_message = "";
	let warning_message = (points == null || points.length < 6) ? " (données insuffisantes)" : ""
	let predictedValue = document.getElementById("predictedValue");
	if (t_0_min == null || t_0_min > countDays(parseInt(dd_min),parseInt(mm_min),6,9)){
		prediction_message = "Non admis";
		predictedValue.innerHTML = prediction_message + warning_message;
		return;
	}
	if(t_0_max == null || t_0_max > countDays(parseInt(dd_min),parseInt(mm_min),6,9)){
		t_0_min = Math.floor(t_0_min);
		let day = parseInt(dd_min) + t_0_min;
        let month = parseInt(mm_min);
        let dpm = daysPerMonth(month);
        while (day > dpm){
            day -= dpm;
            month = month%12 + 1;
            dpm = daysPerMonth(month);
        }
		prediction_message = "Pas admis avant le "+((day<10)?"0":"")+day+"/"+((month<10)?"0":"")+month;
		predictedValue.innerHTML = prediction_message + warning_message;
		return;
	}
	t_0_min = Math.floor(t_0_min);
	t_0_max = Math.floor(t_0_max);
	let day = parseInt(dd_min) + t_0_min;
    let month = parseInt(mm_min);
    let dpm = daysPerMonth(month);
    while (day > dpm){
        day -= dpm;
        month = month%12 + 1;
        dpm = daysPerMonth(month);
    }
	prediction_message = "Admis entre le "+((day<10)?"0":"")+day+"/"+((month<10)?"0":"")+month;

	day = parseInt(dd_min) + t_0_max;
    month = parseInt(mm_min);
    dpm = daysPerMonth(month);
    while (day > dpm){
        day -= dpm;
        month = month%12 + 1;
        dpm = daysPerMonth(month);
    }
	prediction_message = prediction_message+" et le "+((day<10)?"0":"")+day+"/"+((month<10)?"0":"")+month;
	predictedValue.innerHTML = prediction_message + warning_message;
	return;
}

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

function updateCoeffs(){
	if (points == null || points.length==0){
		return;
	}
	let coeffs = computeCoeffs(points);
	error = coeffs.error;
	alpha = coeffs.alpha;
	beta = coeffs.beta;
	unSurTau = coeffs.unSurTau;
	updatePredictedValue();
}

updateCoeffs();