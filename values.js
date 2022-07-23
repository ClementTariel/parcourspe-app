var points = null;
var alpha = null;
var beta = null;
var unSurTau = null;
var error = null;
window.api.send("requestPoints", "some data");
window.api.receive("sendPoints", (data) => {
	points = data;
	let coeffs = computeCoeffs(points);
	error = coeffs.error;
	alpha = coeffs.alpha;
	beta = coeffs.beta;
	unSurTau = coeffs.unSurTau;
	if (goToToday != null){
		goToToday();
	}
	if(updateCoeffs != null){
		updateCoeffs();
	}
});

function resizeCanvasToDisplaySize(canvas) {
   // look up the size the canvas is being displayed
   const width = canvas.clientWidth;
   const height = canvas.clientHeight;

   // If it's resolution does not match change it
   if (canvas.width !== width || canvas.height !== height) {
     canvas.width = width;
     canvas.height = height;
     return true;
   }

   return false;
}
let canvas_height_in_em = 20;
let blank_space_in_em = 2;
let visible_height_in_em = canvas_height_in_em-blank_space_in_em;

var dateSelector = document.getElementById('dateSelector');

var twoMainPanels = document.getElementById('twoMainPanels');
twoMainPanels.style.height = visible_height_in_em+"em";

var canvas = document.getElementById("canvas1");
let ctx = canvas.getContext("2d");
const canvas_width = "30em";
const canvas_height = canvas_height_in_em+"em";
canvas.style.width = canvas_width;
canvas.style.height = canvas_height;
let already_resized = resizeCanvasToDisplaySize(canvas);
var canvas_basic_font = "1em Arial";
ctx.font = canvas_basic_font;
const MWidthToPageEm = 1.2;//not too sure about that
var letterSizeRef = ctx.measureText('M').width;
var canvasBorderRadius = Math.ceil(letterSizeRef*MWidthToPageEm);
var hiddenYOffset = Math.round(blank_space_in_em*letterSizeRef*MWidthToPageEm);

var deletePanel = document.getElementById('deletePanel');
var mainPanel = document.getElementById('mainPanel');
var secondPanel = document.getElementById('secondPanel');
deletePanel.style.marginTop = parseInt(canvas.clientHeight*(visible_height_in_em-0.25/*margin*/)/canvas_height_in_em
	- mainPanel.clientHeight - secondPanel.clientHeight)
	+ "px";

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
