var etab_id = window.location.search.substring(1).slice(2);
if (etab_id == null || parseInt(etab_id)<0){
	window.location.replace("index.html");
}
etab_id = parseInt(etab_id);
var etab_name = null;
var points = null;
var alpha = null;
var beta = null;
var unSurTau = null;
var error = null;
var coeffs = null;
var first_page_refreshed = false;
window.api.send("requestPoints", etab_id);
window.api.receive("sendPoints", (data) => {
	if (data == null){
		window.location.replace("index.html");
	}else{
		points = data["points"];
		etab_name = data["name"];
		document.getElementById("etabName").value = /*sanitize*/(etab_name);
		let coeffs = computeCoeffs(points);
		if (!(coeffs==null || coeffs[0]==null || coeffs[0].alpha==null || coeffs[1]==null || coeffs[1].alpha==null|| coeffs[2]==null || coeffs[2].alpha==null)){
			error = coeffs[0].error || coeffs[1].error || coeffs[2].error;
			alpha = coeffs[1].alpha;
			beta = coeffs[1].beta;
			unSurTau = coeffs[1].unSurTau;
		}
		updatePredictedValue();
		if (typeof updateCanvas === "function" && typeof goToToday === "function" && !first_page_refreshed){
			first_page_refreshed = true;
			goToToday();
		}
		if(typeof updateCoeffs === "function"){
			updateCoeffs();
		}
	}
});

var dateSelector = document.getElementById('dateSelector');

const date = new Date();

const mm_min = '05';
const dd_min = '01';
const mm_max = '08';
const dd_max = '31';
var dd_selected;
var mm_selected;
var date_selected_is_valid = false;

const main_blue = "#212CFF";
const light_blue = "#40F0B0";

var canvasHovered = false;

var month_in_letters = [
	"Janvier",
	"Fevrier",
	"Mars",
	"Avril",
	"Mai",
	"Juin",
	"Juillet",
	"Aout",
	"Septembre",
	"Octobre",
	"Novembre",
	"Decembre"
];

function daysPerMonth(m){
	if (m > 7){
		return 31 - m%2;
	}
	if (m == 2){
		return 28;
	}
	return 30 + m%2;
}
function countDays(d_min,m_min,d_max,m_max){
	let n = 1+d_max-d_min;
	while (m_min<m_max){
		n += daysPerMonth(m_min);
		m_min++;
	}
	return n;
}

function checkDate(d,m){
	let d_min = parseInt(dd_min,10);
	let m_min = parseInt(mm_min,10);
	let d_max = parseInt(dd_max,10);
	let m_max = parseInt(mm_max,10);
	return !(m < m_min || (m == m_min && d < d_min) || m > m_max || (m == m_max && d > d_max)) ;
}

const nb_days = countDays(
	parseInt(dd_min,10),
	parseInt(mm_min,10),
	parseInt(dd_max,10),
	parseInt(mm_max,10)
);
