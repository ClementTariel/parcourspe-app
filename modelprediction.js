function linearRegression(X,Y){

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
	return [A,B];
}


function computeCoeffs(Input){
	if(!Input.length>0){
		return {error:true, alpha:0, beta:0, unSurTau:1};
	}
	/********************************************
			moving average
	********************************************/
	var SmoothInput = [];
	var SmoothInputMin = [];
	var SmoothInputMiddle = [];
	var SmoothInputMax = [];
	if (Input.length > 1){
		if (Input[0][0]+1 == Input[1][0]){
			SmoothInput.push([(Input[0][0]+Input[1][0])/2,(Input[0][1]+Input[1][1])/2]);
			SmoothInputMin.push([(Input[0][0]+Input[1][0])/2,(Input[0][1]+Input[1][1])/2]);
			SmoothInputMax.push([(Input[0][0]+Input[1][0])/2,(Input[0][1]+Input[1][1])/2]);
		}else{
			SmoothInput.push([Input[0][0],Input[0][1]]);
			SmoothInputMin.push([Input[0][0],Input[0][1]]);
			SmoothInputMax.push([Input[0][0],Input[0][1]]);
		}
		for (let i = 1; i<Input.length-1; i++){
			if ((Input[i-1][0]+1 == Input[i][0]) && (Input[i][0] == Input[i+1][0]-1)){
				SmoothInput.push([Input[i][0],(Input[i-1][1]+Input[i][1]+Input[i+1][1])/3]);
				if ((Input[i-1][1]+Input[i][1]+Input[i+1][1])/3 != SmoothInputMin[SmoothInputMin.length-1][1]){
					SmoothInputMin.push([Input[i][0],(Input[i-1][1]+Input[i][1]+Input[i+1][1])/3]);
				}
				if ((Input[i-1][1]+Input[i][1]+Input[i+1][1])/3 != SmoothInputMax[SmoothInputMax.length-1][1]){
					SmoothInputMax.push([Input[i][0],(Input[i-1][1]+Input[i][1]+Input[i+1][1])/3]);
				}else{
					SmoothInputMax[SmoothInputMax.length-1][0] = Input[i][0];
				}
			}else if((Input[i-1][0]+1 == Input[i][0]) && (SmoothInput[SmoothInput.length-1][0] != (Input[i-1][0]+Input[i][0])/2)){
				SmoothInput.push([(Input[i-1][0]+Input[i][0])/2,(Input[i-1][1]+Input[i][1])/2]);
				if ((Input[i-1][1]+Input[i][1])/2 != SmoothInputMin[SmoothInputMin.length-1][1]){
					SmoothInputMin.push([(Input[i-1][0]+Input[i][0])/2,(Input[i-1][1]+Input[i][1])/2]);
				}
				if ((Input[i-1][1]+Input[i][1])/2 != SmoothInputMax[SmoothInputMax.length-1][1]){
					SmoothInputMax.push([(Input[i-1][0]+Input[i][0])/2,(Input[i-1][1]+Input[i][1])/2]);
				}else{
					SmoothInputMax[SmoothInputMax.length-1][0] = (Input[i-1][0]+Input[i][0])/2;
				}
			}else if(Input[i][0]+1 == Input[i+1][0]){
				SmoothInput.push([(Input[i][0]+Input[i+1][0])/2,(Input[i][1]+Input[i+1][1])/2]);
				if ((Input[i][1]+Input[i+1][1])/2 != SmoothInputMin[SmoothInputMin.length-1][1]){
					SmoothInputMin.push([(Input[i][0]+Input[i+1][0])/2,(Input[i][1]+Input[i+1][1])/2]);
				}
				if ((Input[i][1]+Input[i+1][1])/2  != SmoothInputMax[SmoothInputMax.length-1][1]){
					SmoothInputMax.push([(Input[i][0]+Input[i+1][0])/2,(Input[i][1]+Input[i+1][1])/2]);
				}else{
					SmoothInputMax[SmoothInputMax.length-1][0] = (Input[i][0]+Input[i+1][0])/2;
				}
			}else{
				SmoothInput.push([Input[i][0],Input[i][1]]);
				if (Input[i][1] != SmoothInputMin[SmoothInputMin.length-1][1]){
					SmoothInputMin.push([Input[i][0],Input[i][1]]);
				}
				if (Input[i][1]  != SmoothInputMax[SmoothInputMax.length-1][1]){
					SmoothInputMax.push([Input[i][0],Input[i][1]]);
				}else{
					SmoothInputMax[SmoothInputMax.length-1][0] = Input[i][0];
				}
			}
		}
		if (Input[Input.length-2][0]+1 == Input[Input.length-1][0] && SmoothInput[SmoothInput.length-1][0] != (Input[Input.length-2][0]+Input[Input.length-1][0])/2){
			SmoothInput.push([(Input[Input.length-2][0]+Input[Input.length-1][0])/2,(Input[Input.length-2][1]+Input[Input.length-1][1])/2]);
			if ((Input[Input.length-2][1]+Input[Input.length-1][1])/2 != SmoothInputMin[SmoothInputMin.length-1][1]){
				SmoothInputMin.push([(Input[Input.length-2][0]+Input[Input.length-1][0])/2,(Input[Input.length-2][1]+Input[Input.length-1][1])/2]);
			}
			if ((Input[Input.length-2][1]+Input[Input.length-1][1])/2 != SmoothInputMax[SmoothInputMax.length-1][1]){
				SmoothInputMax.push([(Input[Input.length-2][0]+Input[Input.length-1][0])/2,(Input[Input.length-2][1]+Input[Input.length-1][1])/2]);
			}else{
				SmoothInputMax[SmoothInputMax.length-1][0] = (Input[Input.length-2][0]+Input[Input.length-1][0])/2;
			}
		}else{
			SmoothInput.push([Input[Input.length-1][0],Input[Input.length-1][1]]);
			if (Input[Input.length-1][1] != SmoothInputMin[SmoothInputMin.length-1][1]){
				SmoothInputMin.push([(Input[Input.length-2][0]+Input[Input.length-1][0])/2,Input[Input.length-1][1]]);
			}
			if (Input[Input.length-1][1] != SmoothInputMax[SmoothInputMax.length-1][1]){
				SmoothInputMax.push([(Input[Input.length-2][0]+Input[Input.length-1][0])/2,Input[Input.length-1][1]]);
			}else{
				SmoothInputMax[SmoothInputMax.length-1][0] = Input[Input.length-1][0];
			}
		}

		let XSum = SmoothInput[0][0];
		let lastY = SmoothInput[0][1];
		let sameYCount = 1;
		var weight = [];
		for (let i = 1; i<SmoothInput.length; i++){
			while(i<SmoothInput.length && SmoothInput[i][1] == lastY){
				XSum += SmoothInput[i][0]
				sameYCount ++;
				i++;
			}
			weight.push(sameYCount);
			SmoothInputMiddle.push([XSum/sameYCount,lastY]);
			if(i<SmoothInput.length){
				XSum = SmoothInput[i][0];
				lastY = SmoothInput[i][1];
				sameYCount = 1;
			}
			
		}
	}else{
		SmoothInput = Input;
		SmoothInputMin = Input;
		SmoothInputMiddle = Input;
		SmoothInputMax = Input;
	}
	

	/********************************************
			discrete derivative
	( *(-1) to be positive and 
	then be able use a log function)
	********************************************/

	var DSmoothInput = [];
	var DSmoothInputMin = [];
	var DSmoothInputMiddle = [];
	var DSmoothInputMax = [];
	var DWeights = [];
	if (SmoothInput.length > 1){
		for (let i = 0; i<SmoothInput.length-1; i++){
			DSmoothInput.push([(SmoothInput[i][0]+SmoothInput[i+1][0])/2,(SmoothInput[i+1][1]-SmoothInput[i][1])/(SmoothInput[i][0]-SmoothInput[i+1][0])]);
		}
		for (let i = 0; i<SmoothInputMiddle.length-1; i++){
			DWeights.push(weight[i]+weight[i+1])
			DSmoothInputMin.push([(SmoothInputMin[i][0]+SmoothInputMin[i+1][0])/2,(SmoothInputMin[i+1][1]-SmoothInputMin[i][1])/(SmoothInputMin[i][0]-SmoothInputMin[i+1][0])]);
			DSmoothInputMiddle.push([(SmoothInputMiddle[i][0]+SmoothInputMiddle[i+1][0])/2,(SmoothInputMiddle[i+1][1]-SmoothInputMiddle[i][1])/(SmoothInputMiddle[i][0]-SmoothInputMiddle[i+1][0])]);
			DSmoothInputMax.push([(SmoothInputMax[i][0]+SmoothInputMax[i+1][0])/2,(SmoothInputMax[i+1][1]-SmoothInputMax[i][1])/(SmoothInputMax[i][0]-SmoothInputMax[i+1][0])]);
		}
	}

	/********************************************
			 log
	********************************************/

	var X = [];
	var Y = [];

	var X3 = [[],[],[]];
	var Y3 = [[],[],[]];

	for (let i = 0; i<DSmoothInput.length; i++){
		if(DSmoothInput[i][1] > 0){
			X.push(DSmoothInput[i][0]);
			Y.push(Math.log(DSmoothInput[i][1]));
		}
	}
	for (let i = 0; i<DSmoothInputMiddle.length; i++){
		for (let j = 0; j<DWeights[i]; j++){
			X3[0].push(DSmoothInputMin[i][0]);
			Y3[0].push(Math.log(DSmoothInputMin[i][1]));

			X3[1].push(DSmoothInputMiddle[i][0]);
			Y3[1].push(Math.log(DSmoothInputMiddle[i][1]));

			X3[2].push(DSmoothInputMax[i][0]);
			Y3[2].push(Math.log(DSmoothInputMax[i][1]));
		}	
	}

	/********************************************
			linear regression
	********************************************/

	var A;
	var B;
	var coeffs = [{},{},{}];
	for (let k = 0; k<3; k++){
		let A_and_B = linearRegression(X3[k],Y3[k]);
		A = A_and_B[0];
		B = A_and_B[1];

		/********************************************
				back to exp
		********************************************/

		// y(t) = alpha*exp(t*unSurTau)+beta
		var unSurTau = A;
		let threshold = 1/10**9;
		if (unSurTau**2<threshold**2){
			unSurTau = threshold;
		}
		var alpha = 0;
		if(X3[k].length>0){
			alpha = -Math.exp(B)/unSurTau;
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
			var Xoutput = [];
			var Youtput = [];

			for (let i = 0; i<Input.length; i++){
				Xoutput.push(Input[i][1]);
				Youtput.push(alpha*Math.exp(Input[i][0]*unSurTau)+beta);
			}

			var XSum = 0;
			var XMean = 0;

			var YSum = 0;
			var YMean = 0;

			for (var i = 0; i < Xoutput.length; i++) {
				XSum += Xoutput[i];
				YSum += Youtput[i];
			}

			XMean = XSum / Xoutput.length;
			YMean = YSum / Youtput.length;

			var XDeviation = [];
			var XDeviationSum = 0;

			var YDeviation = [];
			var YDeviationSum = 0;

			var XYDeviationProduct = [];
			var XYDeviationProductSum = 0;

			for (var i = 0; i < Xoutput.length; i++) {
				XDeviation.push(Xoutput[i] - XMean);
				YDeviation.push(Youtput[i] - YMean);
				XYDeviationProduct.push(XDeviation[i] * YDeviation[i]);
				XYDeviationProductSum  += XYDeviationProduct[i];
				XDeviationSum += XDeviation[i]*XDeviation[i];
				YDeviationSum += YDeviation[i]*YDeviation[i];
			}
		}
		//alert(alpha+";"+beta+";"+unSurTau);
		coeffs[k] =  {error:false, alpha:alpha, beta:beta, unSurTau:unSurTau};
	}
	//return {error:false, alpha:alpha, beta:beta, unSurTau:unSurTau};
	return coeffs;
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