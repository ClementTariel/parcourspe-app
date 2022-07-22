
function computeCoeffs(Input){
	if(!Input.length>0){
		return {error:true, alpha:0, beta:0, unSurTau:1};
	}
	/********************************************
			moving average
	********************************************/
	var SmoothInput = [];
	if (Input.length > 1){
		if (Input[0][0]+1 == Input[1][0]){
			SmoothInput.push([(Input[0][0]+Input[1][0])/2,(Input[0][1]+Input[1][1])/2]);
		}else{
			SmoothInput.push([Input[0][0],Input[0][1]]);
		}
		for (let i = 1; i<Input.length-1; i++){
			if ((Input[i-1][0]+1 == Input[i][0]) && (Input[i][0] == Input[i+1][0]-1)){
				SmoothInput.push([Input[i][0],(Input[i-1][1]+Input[i][1]+Input[i+1][1])/3]);
			}else if((Input[i-1][0]+1 == Input[i][0]) && (SmoothInput[SmoothInput.length-1][0] != (Input[i-1][0]+Input[i][0])/2)){
				SmoothInput.push([(Input[i-1][0]+Input[i][0])/2,(Input[i-1][1]+Input[i][1])/2]);
			}else if(Input[i][0]+1 == Input[i+1][0]){
				SmoothInput.push([(Input[i][0]+Input[i+1][0])/2,(Input[i][1]+Input[i+1][1])/2]);
			}else{
				SmoothInput.push([Input[i][0],Input[i][1]]);
			}
		}
		if (Input[Input.length-2][0]+1 == Input[Input.length-1][0] && SmoothInput[SmoothInput.length-1][0] != (Input[Input.length-2][0]+Input[Input.length-1][0])/2){
			SmoothInput.push([(Input[Input.length-2][0]+Input[Input.length-1][0])/2,(Input[Input.length-2][1]+Input[Input.length-1][1])/2]);
		}else{
			SmoothInput.push([Input[Input.length-1][0],Input[Input.length-1][1]]);
		}
	}else{
		SmoothInput = Input;
	}

	/********************************************
			discrete derivative
	( *(-1) to be positive and 
	then be able use a log function)
	********************************************/

	var DSmoothInput = [];
	if (SmoothInput.length > 1){
		for (let i = 0; i<SmoothInput.length-1; i++){
			DSmoothInput.push([(SmoothInput[i][0]+SmoothInput[i+1][0])/2,(SmoothInput[i+1][1]-SmoothInput[i][1])/(SmoothInput[i][0]-SmoothInput[i+1][0])]);
		}
	}

	/********************************************
			 log
	********************************************/

	var X = [];
	var Y = [];

	for (let i = 0; i<DSmoothInput.length; i++){
		if(DSmoothInput[i][1] > 0){
			X.push(DSmoothInput[i][0]);
			Y.push(Math.log(DSmoothInput[i][1]));
		}
	}

	/********************************************
			linear regression
	********************************************/

	if(X.length>0){
		var XSum = 0;
		var XMean = 0;

		var YSum = 0;
		var YMean = 0;

		for (var i = 0; i < X.length; i++) {
			XSum += X[i];
			YSum += Y[i];
		}

		XMean = XSum / X.length;
		YMean = YSum / Y.length;

		var XDeviation = [];
		var XDeviationSum = 0;

		var YDeviation = [];
		var YDeviationSum = 0;

		var XYDeviationProduct = [];
		var XYDeviationProductSum = 0;

		for (var i = 0; i < X.length; i++) {
			XDeviation.push(X[i] - XMean);
			YDeviation.push(Y[i] - YMean);
			XYDeviationProduct.push(XDeviation[i] * YDeviation[i]);
			XYDeviationProductSum  += XYDeviationProduct[i];
			XDeviationSum += Math.pow(XDeviation[i],2);
			YDeviationSum += Math.pow(YDeviation[i],2);
		}

		// Y = AX+B
		var A = XYDeviationProductSum / XDeviationSum;
		var B = YMean - A * XMean;

	}else{
		A = 1;
		B = 1;
	}
	/********************************************
			back to exp
	********************************************/

	// y(t) = alpha*exp(t*unSurTau)+beta
	var unSurTau = A;
	var alpha = 0;
	if(X.length>0){
		alpha = -Math.exp(B)/A;
	}
	var beta = 0;
	var ySum = 0;
	for (let i = 0; i<Input.length; i++){
		beta += Input[i][1] - alpha*Math.exp(Input[i][0]*unSurTau);
		ySum += Input[i][1];
	}
	if(Input.length>0){
		beta = beta / Input.length;
	}
	if (Input.length>3){
		var X = [];
		var Y = [];

		for (let i = 0; i<Input.length; i++){
			X.push(Input[i][1]);
			Y.push(alpha*Math.exp(Input[i][0]*unSurTau)+beta);
		}

		var XSum = 0;
		var XMean = 0;

		var YSum = 0;
		var YMean = 0;

		for (var i = 0; i < X.length; i++) {
			XSum += X[i];
			YSum += Y[i];
		}

		XMean = XSum / X.length;
		YMean = YSum / Y.length;

		var XDeviation = [];
		var XDeviationSum = 0;

		var YDeviation = [];
		var YDeviationSum = 0;

		var XYDeviationProduct = [];
		var XYDeviationProductSum = 0;

		for (var i = 0; i < X.length; i++) {
			XDeviation.push(X[i] - XMean);
			YDeviation.push(Y[i] - YMean);
			XYDeviationProduct.push(XDeviation[i] * YDeviation[i]);
			XYDeviationProductSum  += XYDeviationProduct[i];
			XDeviationSum += XDeviation[i]*XDeviation[i];
			YDeviationSum += YDeviation[i]*YDeviation[i];
		}
	}
	return {error:false, alpha:alpha, beta:beta, unSurTau:unSurTau};
}


function f1(alpha,beta,unSurTau,t){
    return alpha*Math.exp(t*unSurTau)+beta;
}

function inverse_f1(alpha,beta,unSurTau,y){
	if (alpha != 0 && unSurTau != 0){
		y = (y-beta)/alpha;
		y = y;
		if (y>0){
			return Math.log(y)/unSurTau;
		}	
	}
	return null;
}