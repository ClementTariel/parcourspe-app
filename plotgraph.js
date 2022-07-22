document.onmousemove = followMouse;
document.onclick = selectClickedDate;

var show_date_on_the_right = true;
var show_date_above = true;

function dayToX(d){
    return (canvas.width)*(d-0.5)/nb_days;
}

function rankToY(canvas,r){
    let ref;
    if (points != null && points.length > 0){
        ref=points[0][1];
    }else{
        ref = 99999;
    }
    let ctx = canvas.getContext("2d");
    return (canvas.height - hiddenYOffset)*(0.9-0.8*r/ref);
}

function updateCanvas(x,y){
    var canvas = document.getElementById('canvas1');
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    initDraw(canvas,canvasHovered);

    var offsetX = canvas.offsetLeft;    
    var offsetY = canvas.offsetTop;
    if (x > offsetX && x < offsetX + canvas.width && y > offsetY && y < offsetY + canvas.height - hiddenYOffset){

        canvasHovered = true;

        let deltax = (canvas.width)/(nb_days);
        let deltay = 1;
        let roundx = Math.round((Math.ceil((x-offsetX)/deltax)-0.5)*deltax);
        
        let day = parseInt(dd_min) + Math.floor((x-offsetX)/deltax);
        let month = parseInt(mm_min);
        let dpm = daysPerMonth(month);
        while (day > dpm){
            day -= dpm;
            month = month%12 + 1;
            dpm = daysPerMonth(month);
        }
        month = month_in_letters[month-1];

        ctx.beginPath();
        ctx.lineWidth = 5;
        let smoothYOffset = Math.ceil(2+ctx.lineWidth/2);
        let radius = canvasBorderRadius;
        if (x < offsetX + radius){
            smoothYOffset += Math.ceil(radius - Math.sqrt(radius**2 - (radius - roundx)**2));
            if (x< offsetX + ctx.lineWidth){
                ctx.lineWidth = Math.ceil(x-offsetX);
                roundx+=ctx.lineWidth;
            }
        }else if(x > offsetX + canvas.width - radius){
            smoothYOffset += Math.ceil(radius - Math.sqrt(radius**2 - (roundx- canvas.width + radius)**2));
            if (x >  offsetX + canvas.width - ctx.lineWidth){
                ctx.lineWidth = Math.ceil(offsetX + canvas.width - x);
                roundx-=ctx.lineWidth;
            }
        }
        ctx.moveTo(roundx,smoothYOffset);
        ctx.lineTo(roundx,canvas.height - hiddenYOffset - smoothYOffset);
        ctx.strokeStyle = light_blue;
        ctx.stroke();
        
        ctx.fillStyle = light_blue;
        ctx.beginPath();
        ctx.arc(roundx, smoothYOffset , ctx.lineWidth/2, 0, 2*Math.PI);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(roundx, canvas.height - hiddenYOffset - smoothYOffset , ctx.lineWidth/2, 0, 2*Math.PI);
        ctx.fill();

        ctx.font = canvas_basic_font;
        let txt = day+" "+month;

        if (!show_date_on_the_right && x < offsetX + 2*ctx.measureText(txt+"M").width){
            show_date_on_the_right = true;
        }
        if (show_date_on_the_right && x > offsetX + canvas.width - 2*ctx.measureText(txt+"M").width ){
            show_date_on_the_right = false;
        }
        if (show_date_above && y < offsetY + 3*Math.round(ctx.measureText('M').width)){
            show_date_above = false;
        }
        if (!show_date_above && y > offsetY + canvas.height - 6*Math.round(ctx.measureText('M').width)){
            show_date_above = true;
        }


        let txt_offset_x;
        if (!show_date_on_the_right){
            txt_offset_x = - Math.round(ctx.measureText(txt+"  ").width);
        }else{
            txt_offset_x = Math.round(ctx.measureText("  ").width);
        }
        let txt_offset_y = Math.round(Math.round(ctx.measureText('M').width));// the width is almost the same as the height
        if (show_date_above){
            txt_offset_y  = - txt_offset_y;
        }else{
            txt_offset_y *= 3;
        }

        plotPrediction(canvas,alpha,beta,unSurTau,error);
        plotPoints(canvas,points);

        ctx.fillStyle = "black";
        ctx.fillText(txt, roundx + txt_offset_x,  y - offsetY + txt_offset_y);

    }else{
        canvasHovered = false;
        plotPrediction(canvas,alpha,beta,unSurTau,error);
        plotPoints(canvas,points);
    }
    if (date_selected_is_valid){
        showDateSelected(canvas,dd_selected,mm_selected);
    }    

}



function followMouse(evenement)
{
    
    var x =  evenement.pageX;
    var y =  evenement.pageY;
    
    updateCanvas(x,y);
}

function selectClickedDate(evenement){
    var canvas = document.getElementById('canvas1');
    var ctx = canvas.getContext("2d");
    
    var x =  evenement.pageX;
    var y =  evenement.pageY;
    
    var offsetX = canvas.offsetLeft;    
    var offsetY = canvas.offsetTop;

    if (x > offsetX && x < offsetX + canvas.width && y > offsetY && y < offsetY + canvas.height - hiddenYOffset){

        let deltax = (canvas.width)/(nb_days);
        let deltay = 1;
        let roundx = Math.round((Math.ceil((x-offsetX)/deltax)-0.5)*deltax);
        
        let day = parseInt(dd_min) + Math.floor((x-offsetX)/deltax);
        let month = parseInt(mm_min);
        let dpm = daysPerMonth(month);
        while (day > dpm){
            day -= dpm;
            month = month%12 + 1;
            dpm = daysPerMonth(month);
        }

        if (checkDate(day,month)){
            date_selected_is_valid = true;
            dd_selected = day.toString();
            if (day < 10){
                dd_selected = "0"+dd_selected;
            }
            mm_selected = month.toString();
            if (month < 10){
                mm_selected = "0"+mm_selected;
            }

            var dateSelector = document.getElementById('dateSelector');
            const d = new Date();
            var yyyy = d.getFullYear();
            dateSelector.value = yyyy+'-'+mm_selected+'-'+dd_selected;
            
            displayRank(parseInt(dd_selected),parseInt(mm_selected));
            
            updateCanvas(x,y);
        }  
    }
    
}

function initDraw(canvas,isSelected) {
    let borderColor = isSelected ? main_blue : "black";
    let borderSize = isSelected ? 2 : 1;
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "#EEEEEE";
    ctx.fillRect(0, 0, canvas.width, canvas.height - hiddenYOffset);
    ctx.lineWidth = 1;
    ctx.strokeStyle = borderColor;
    ctx.beginPath();
    ctx.rect(0, 0, canvas.width, canvas.height - hiddenYOffset);
    ctx.stroke();
    if (isSelected){
        ctx.lineWidth = 1;
        ctx.strokeStyle = main_blue;
        ctx.beginPath();
        ctx.rect(0, 0, canvas.width-1, canvas.height - hiddenYOffset);
        ctx.rect(1, 1, canvas.width-2, canvas.height-1 - hiddenYOffset);
        ctx.stroke();
    }
    let radius = canvasBorderRadius;
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, radius,radius);
    ctx.fillRect(canvas.width - radius, 0, canvas.width ,radius);
    ctx.fillRect(0, canvas.height - hiddenYOffset - radius, radius, canvas.height - hiddenYOffset);
    ctx.fillRect(canvas.width - radius, canvas.height - hiddenYOffset - radius, canvas.width,  canvas.height - hiddenYOffset);

    ctx.fillStyle = "#EEEEEE";
    ctx.beginPath();
    ctx.arc(radius, radius, radius - borderSize, 0, 2*Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(canvas.width - radius, radius, radius - borderSize, 0, 2*Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(radius, canvas.height - hiddenYOffset - radius, radius - borderSize, 0, 2*Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(canvas.width - radius, canvas.height - hiddenYOffset - radius, radius - borderSize, 0, 2*Math.PI);
    ctx.fill();

    ctx.lineWidth = 1;
    ctx.strokeStyle = borderColor;
    ctx.beginPath();
    ctx.arc(radius, radius, radius, Math.PI, -Math.PI/2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(canvas.width - radius, radius, radius, -Math.PI/2, 0);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(radius, canvas.height - hiddenYOffset - radius, radius, Math.PI/2, Math.PI);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(canvas.width - radius, canvas.height - hiddenYOffset - radius, radius, 0, Math.PI/2);
    ctx.stroke();
    if (isSelected){ 
        ctx.beginPath();
        ctx.arc(radius, radius, radius - 1, Math.PI, -Math.PI/2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(canvas.width - radius, radius, radius - 1, -Math.PI/2, 0);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(radius, canvas.height - hiddenYOffset - radius, radius - 1, Math.PI/2, Math.PI);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(canvas.width - radius, canvas.height - hiddenYOffset - radius, radius - 1, 0, Math.PI/2);
        ctx.stroke();
    }
}

function plotPrediction(canvas,alpha,beta,unSurTau,error){
    if (points == null || points.length == 0 || error || alpha == null || beta == null || unSurTau == null){
        return;
    }
    let functionColor = 'orange';
    let ctx = canvas.getContext('2d');
    ctx.lineWidth = 1;
    let n = nb_days;
    ctx.beginPath();
    ctx.strokeStyle ='#A0A0A0';
    ctx.moveTo(1, Math.round(rankToY(canvas,0)));
    ctx.lineTo(canvas.width-1, Math.round(rankToY(canvas,0)));
    ctx.stroke();
    ctx.beginPath();
    ctx.strokeStyle = functionColor;
    let rank_i = rankToY(canvas,f1(alpha,beta,unSurTau,0));
    let next_rank = rank_i;
    let x_i = 0;
    let next_x = x_i;
    let max_y;
    let min_y;
    let radius = canvasBorderRadius;
    let y_from;
    let y_to;
    for (let i = 0; i < n; i++) {
        next_rank = f1(alpha,beta,unSurTau,i+1);
        next_x = Math.round(canvas.width*(i+1)/n);

        max_y = canvas.height - hiddenYOffset;
        min_y = 0;
        if (x_i < radius){
            min_y = Math.ceil(radius - Math.sqrt(radius**2 - (radius - x_i)**2));
            max_y = canvas.height - hiddenYOffset - min_y;
        }else if (next_x > canvas.width - radius){
            min_y = Math.ceil(radius - Math.sqrt(radius**2 - (next_x - canvas.width + radius)**2));
            max_y = canvas.height - hiddenYOffset - min_y;
        }
        y_from = rankToY(canvas,rank_i);
        y_to = rankToY(canvas,next_rank);
        if (y_from<y_to){
            if (y_from < max_y && y_to >= max_y){
                let t = (y_to-max_y)/(y_to-y_from);
                next_x = x_i*t + next_x*(1-t);
                y_to = max_y;
            }else if (y_from <= min_y && y_to > min_y){
                let t = (min_y-y_from)/(y_to-y_from);
                x_i = x_i*(1-t) + next_x*t;
                y_from = min_y;
            }
        }
        if (!(y_from < min_y || y_from > max_y || y_to < min_y || y_to > max_y)){
            ctx.moveTo(x_i, y_from);
            ctx.lineTo(next_x, y_to);
        }
        if (rank_i>0 && next_rank<=0){
            ctx.stroke();
            ctx.beginPath();
            ctx.strokeStyle = 'green';
            ctx.arc(Math.round(canvas.width*(i+0.5)/n), rankToY(canvas,0), 2, 0, 2 * Math.PI);
            ctx.stroke();
            ctx.strokeStyle = functionColor;
            ctx.beginPath();
        }
        rank_i = next_rank;
        x_i = next_x
    }
    ctx.stroke();

}

function plotPoints(canvas,points){
    if (points != null && points.length>0){
        let ctx = canvas.getContext('2d');
        ctx.lineWidth = 1;
        ctx.strokeStyle ='black';
        for (let i=0; i<points.length; i++){
            ctx.beginPath();
            ctx.arc(Math.round(dayToX(points[i][0])), Math.round(rankToY(canvas,points[i][1])), 2, 0, 2 * Math.PI);
            ctx.stroke(); 
        }
    }
}

function showDateSelected(canvas,dd,mm){
    var ctx = canvas.getContext("2d");
    let txt = dd+"/"+mm;
    let n = countDays(
        parseInt(dd_min,10),
        parseInt(mm_min,10),
        parseInt(dd,10),
        parseInt(mm,10)
    );
    ctx.fillStyle = "black";
    ctx.font = canvas_basic_font;
    let xpos = dayToX(n);
    let txt_x = Math.round(xpos);
    if (txt_x < ctx.measureText(txt+'M').width/2){
        txt_x = Math.ceil(Math.round(ctx.measureText('M').width)/2);
    }else if (txt_x + ctx.measureText(txt+'M').width/2 > canvas.width){
        txt_x = canvas.width - Math.ceil(ctx.measureText(txt).width + Math.round(ctx.measureText('M').width)/2);
    }else{
        txt_x = Math.round(xpos - ctx.measureText(txt).width/2);
    }
    ctx.fillText(txt,txt_x,  canvas.height - Math.round(Math.round(ctx.measureText('M').width)/2));

    ctx.beginPath();
    ctx.lineWidth = 2;
    let smoothYOffset = 1;
    let roundx = Math.round(xpos);
    let radius = canvasBorderRadius;
    if (xpos < radius){
        smoothYOffset += Math.ceil(radius - Math.sqrt(radius**2 - (radius - roundx)**2));
        if (xpos< ctx.lineWidth){
            ctx.lineWidth = Math.ceil(xpos);
            roundx+=ctx.lineWidth;
        }
    }else if(xpos > canvas.width - radius){
        smoothYOffset += Math.ceil(radius - Math.sqrt(radius**2 - (roundx- canvas.width + radius)**2));
        if (xpos >  canvas.width - ctx.lineWidth){
            ctx.lineWidth = Math.ceil(canvas.width - xpos);
            roundx-=ctx.lineWidth;
        }
    }
    ctx.moveTo(Math.round(xpos),smoothYOffset);
    ctx.lineTo(Math.round(xpos),canvas.height - hiddenYOffset - smoothYOffset);
    ctx.strokeStyle = "grey";
    ctx.stroke();
    
}
