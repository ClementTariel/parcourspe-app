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

const debounce = (func, wait, immediate, arguments) => {
    var timeout;
    return () => {
        const context = this;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context);
    };
};

function organizeScreen(){
    var win_width = window.innerWidth;
    var win_height = window.innerHeight;
    var canvas = document.getElementById("canvas1");
    var twoMainPanels = document.getElementById('twoMainPanels');
    var container = document.getElementById('container');
    var mainPanel = document.getElementById('mainPanel');
    var secondPanel = document.getElementById('secondPanel');
    var predictionPanel = document.getElementById('predictionPanel');
    var side_margin = 0;
    if (container.currentStyle) {
        side_margin += parseInt(container.currentStyle.marginRight.slice(0,-2));
        //side_margin += parseInt(container.currentStyle.paddingRight.slice(0,-2));
        side_margin += parseInt(container.currentStyle.marginLeft.slice(0,-2));
        //side_margin += parseInt(container.currentStyle.paddingLeft.slice(0,-2));
    } else if (window.getComputedStyle) {
        side_margin += parseInt(window.getComputedStyle(container, null).getPropertyValue("margin-right").slice(0,-2));
        //side_margin += parseInt(window.getComputedStyle(container, null).getPropertyValue("padding-right").slice(0,-2));
        side_margin += parseInt(window.getComputedStyle(container, null).getPropertyValue("margin-left").slice(0,-2));
        //side_margin += parseInt(window.getComputedStyle(container, null).getPropertyValue("padding-left").slice(0,-2));
    }
    var measured_canvas_width = canvas.offsetWidth;
    var middle_margin = 0;
    if (canvas.currentStyle) {
        middle_margin += parseInt(canvas.currentStyle.marginRight.slice(0,-2));
        side_margin += parseInt(canvas.currentStyle.marginLeft.slice(0,-2));
    } else if (window.getComputedStyle) {
        middle_margin += parseInt(window.getComputedStyle(canvas, null).getPropertyValue("margin-right").slice(0,-2));
        side_margin += parseInt(window.getComputedStyle(canvas, null).getPropertyValue("margin-left").slice(0,-2));
    }
    if (twoMainPanels.currentStyle) {
        side_margin += parseInt(twoMainPanels.currentStyle.marginRight.slice(0,-2));
        middle_margin += parseInt(twoMainPanels.currentStyle.marginLeft.slice(0,-2));
    } else if (window.getComputedStyle) {
        side_margin += parseInt(window.getComputedStyle(twoMainPanels, null).getPropertyValue("margin-right").slice(0,-2));
        middle_margin += parseInt(window.getComputedStyle(twoMainPanels, null).getPropertyValue("margin-left").slice(0,-2));
    }
    //main panel inner width 11.25em min
    //second panel inner width 15.675em min
    var second_panel_width = 17*pageEmToPixels;
    if (win_width > 2*side_margin + ref_canvas_height_in_em*pageEmToPixels + middle_margin + second_panel_width){
        
        predictionPanel.style.width = "auto";
        canvas_width_in_em = win_width - 2*side_margin - middle_margin - second_panel_width;
        canvas_width_in_em /= pageEmToPixels;
        canvas_width = canvas_width_in_em+"em";
        canvas.style.width = canvas_width;
        if (canvas_width_in_em > ref_canvas_width_in_em){
            canvas_width_in_em = ref_canvas_width_in_em;
            canvas_width = canvas_width_in_em+"em";
            canvas.style.width = canvas_width;
        }
        canvas_height_in_em = ref_canvas_height_in_em;
        height = canvas_height_in_em+"em";
        canvas.style.height = canvas_height;
        resizeCanvasToDisplaySize(canvas);
        //full size
        document.getElementById("subBlock1").style.flexDirection = "row";
        //document.getElementById("subBlock2").style.flexDirection = "column";
        twoMainPanels.style.display = "flex";
        twoMainPanels.style.flexDirection = "column";
        twoMainPanels.style.width = "auto";
        canvas.style.marginLeft = "0.25em";
        canvas.style.marginRight = "0.25em";
        twoMainPanels.style.height = visible_height_in_em+"em";
        mainPanel.style.width = "auto";
        mainPanel.style.flexGrow = "0";
        deletePanel.style.marginTop = "0px";
        secondPanel.style.marginTop = "0.5em";
        secondPanel.style.width = "auto";
        secondPanel.style.width = "17em";
        secondPanel.style.height = "fit-content";
        deletePanel.style.marginTop = parseInt(canvas.clientHeight*(visible_height_in_em-0.75/*margin*/)/canvas_height_in_em
        - mainPanel.clientHeight - secondPanel.clientHeight) + "px";        
    }else{
        document.getElementById("subBlock1").style.flexDirection = "column-reverse";
        //document.getElementById("subBlock2").style.flexDirection = "row";
        twoMainPanels.style.display = "flex";
        twoMainPanels.style.flexDirection = "row";
        deletePanel.style.marginTop = "0.25em";
        twoMainPanels.style.height = "fit-content";

        side_margin = 0;
        middle_margin = 0;
        if (mainPanel.currentStyle) {
            middle_margin += parseInt(mainPanel.currentStyle.marginRight.slice(0,-2));
            side_margin += parseInt(mainPanel.currentStyle.marginLeft.slice(0,-2));
        } else if (window.getComputedStyle) {
            middle_margin += parseInt(window.getComputedStyle(mainPanel, null).getPropertyValue("margin-right").slice(0,-2));
            side_margin += parseInt(window.getComputedStyle(mainPanel, null).getPropertyValue("margin-left").slice(0,-2));
        }
        if (secondPanel.currentStyle) {
            side_margin += parseInt(secondPanel.currentStyle.marginRight.slice(0,-2));
            middle_margin += parseInt(secondPanel.currentStyle.marginLeft.slice(0,-2));
        } else if (window.getComputedStyle) {
            side_margin += parseInt(window.getComputedStyle(secondPanel, null).getPropertyValue("margin-right").slice(0,-2));
            middle_margin += parseInt(window.getComputedStyle(secondPanel, null).getPropertyValue("margin-left").slice(0,-2));
        }
        if (twoMainPanels.currentStyle) {
            side_margin += parseInt(twoMainPanels.currentStyle.marginRight.slice(0,-2));
            side_margin += parseInt(twoMainPanels.currentStyle.marginLeft.slice(0,-2));
        } else if (window.getComputedStyle) {
            side_margin += parseInt(window.getComputedStyle(twoMainPanels, null).getPropertyValue("margin-right").slice(0,-2));
            side_margin += parseInt(window.getComputedStyle(twoMainPanels, null).getPropertyValue("margin-left").slice(0,-2));
        }
        if (container.currentStyle) {
            side_margin += parseInt(container.currentStyle.marginRight.slice(0,-2));
            side_margin += parseInt(container.currentStyle.marginLeft.slice(0,-2));
        } else if (window.getComputedStyle) {
            side_margin += parseInt(window.getComputedStyle(container, null).getPropertyValue("margin-right").slice(0,-2));
            side_margin += parseInt(window.getComputedStyle(container, null).getPropertyValue("margin-left").slice(0,-2));
        }
        var prediction_panel_side_margin = 0;
        if (predictionPanel.currentStyle) {
            prediction_panel_side_margin += parseInt(predictionPanel.currentStyle.marginRight.slice(0,-2));
            prediction_panel_side_margin += parseInt(predictionPanel.currentStyle.paddingRight.slice(0,-2));
            prediction_panel_side_margin += parseInt(predictionPanel.currentStyle.marginLeft.slice(0,-2));
            prediction_panel_side_margin += parseInt(predictionPanel.currentStyle.paddingLeft.slice(0,-2));
        } else if (window.getComputedStyle) {
            prediction_panel_side_margin += parseInt(window.getComputedStyle(predictionPanel, null).getPropertyValue("margin-right").slice(0,-2));
            prediction_panel_side_margin += parseInt(window.getComputedStyle(predictionPanel, null).getPropertyValue("padding-right").slice(0,-2));
            prediction_panel_side_margin += parseInt(window.getComputedStyle(predictionPanel, null).getPropertyValue("margin-left").slice(0,-2));
            prediction_panel_side_margin += parseInt(window.getComputedStyle(predictionPanel, null).getPropertyValue("padding-left").slice(0,-2));
        }
        secondPanel.style.marginTop = "0px";
        // min 6em max 12em
        secondPanel.style.width = "6em";
        secondPanel.style.height = "auto";
        secondPanel.style.padding = "auto";
        twoMainPanels.style.width = win_width - side_margin + "px";
        mainPanel.style.flexGrow = "1";

        predictionPanel.style.width = twoMainPanels.offsetWidth - prediction_panel_side_margin + "px";
        canvas_width_in_em = predictionPanel.offsetWidth/pageEmToPixels;
        canvas_width = canvas_width_in_em+"em";
        canvas.style.width = canvas_width;

        // min 12em
        if (mainPanel.offsetWidth < 12*pageEmToPixels){
            twoMainPanels.style.display = "flex";
            twoMainPanels.style.flexDirection = "column";
            deletePanel.style.marginTop = "0.25em";
            secondPanel.style.marginTop = "0.5em";
            secondPanel.style.width = "auto";
            twoMainPanels.style.height = "fit-content";
        }
        canvas_height_in_em = 9*canvas_width_in_em/16+blank_space_in_em;
        canvas_height = canvas_height_in_em+"em";
        canvas.style.height = canvas_height;
    }
    resizeCanvasToDisplaySize(canvas);
    if (typeof updateCanvas === "function"){
        updateCanvas(-1,-1);
    }
}

window.addEventListener('resize', debounce(() => organizeScreen(),
250, false), false);


const ref_canvas_height_in_em = 19.5;
const ref_canvas_width_in_em = 32;
var canvas_height_in_em = ref_canvas_height_in_em;
var canvas_width_in_em = ref_canvas_width_in_em;
var blank_space_in_em = 1.5;
var visible_height_in_em = canvas_height_in_em-blank_space_in_em;

var twoMainPanels = document.getElementById('twoMainPanels');
twoMainPanels.style.height = visible_height_in_em+"em";

var canvas = document.getElementById("canvas1");
let ctx = canvas.getContext("2d");
var canvas_width = canvas_width_in_em+"em";
var canvas_height = canvas_height_in_em+"em";
canvas.style.width = canvas_width;
canvas.style.height = canvas_height;
let already_resized = resizeCanvasToDisplaySize(canvas);
var canvas_basic_font = "1em Arial";
ctx.font = canvas_basic_font;

const pageEmToPixels = canvas.clientWidth/canvas_width_in_em;
var canvasBorderRadius = Math.ceil(1*pageEmToPixels);
var hiddenYOffset = Math.round(blank_space_in_em*pageEmToPixels);

organizeScreen();

