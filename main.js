let file_uploded = 0;
let imageCanvas = document.querySelector('#imageCanvas');
const fileInput = document.querySelector("#files");
console.log("hello world");
fileInput.addEventListener('change',(event)=>{
	file_uploded = 1;  
	let selectedFile = event.target.files[0];
	const url = URL.createObjectURL(selectedFile); 
	document.querySelector('.originalImage').src = url;
	document.querySelector('.originalImage').classList.remove('hidden');
});
const encrypt = document.querySelector('.encrypt');

encrypt.addEventListener('click',()=>{
	if(file_uploded===1) {
		console.log('ready');
		createImageCanvas();
		document.querySelector('.download').style.display = "block";
		document.querySelector('.result').style.display="flex";
		document.querySelector('.data-extracted').style.display = "none";
	}
	else alert("select image file");
});
function createImageCanvas(){ 
	let img = new Image();
	img.src = URL.createObjectURL(fileInput.files[0]);
	img.onload = function(){
		imageCanvas.width = img.width;
		imageCanvas.height = img.height;
		const ctx = imageCanvas.getContext("2d");
		ctx.drawImage(img, 0, 0);
		const imageData = ctx.getImageData(0,0,imageCanvas.width,imageCanvas.height);
		const pixelData = imageData.data;		
		let message = document.querySelector('.content').value;
		message = ("Valid\n"+message);
		const arr = [];
		for(let i=0;i<message.length;i++) {
			let x = message[i].charCodeAt(0);
			let  a=128;
			while(a>0){
				if(((a&x) === a)) {
					arr.push(1);
				}
				else arr.push(0);
				a>>=1;
			}	
		}
		for (let i = 0; ((i < pixelData.length)); i += 1) {
			pixelData[i] &=252 ; 
		}
		let ctr=0;
		for(let i=0;i<arr.length;i+=2){
			pixelData[ctr] += (2*arr[i] + arr[i+1]);
			ctr++;
		}
		ctx.putImageData(imageData, 0, 0);  
	}
	document.querySelector('.download').addEventListener('click',()=>{
		imageCanvas.toBlob(function(blob) {
			const downloadLink = document.createElement('a');
			downloadLink.download = 'myCanvasImage.png';
			const url = URL.createObjectURL(blob);
			downloadLink.href = url;
			downloadLink.click();
			URL.revokeObjectURL(url);
		  }, 'image/png');
	});	
	const download = document.querySelector('.download');
	download.href = img.src;	
}
document.querySelector('.extract').addEventListener('click',()=>{
	if(file_uploded===1) {
			document.querySelector('.result').style.display = "none";
			document.querySelector('.download').style.display = "none";	
			document.querySelector('.data-extracted').style.display = "flex";
			let imageCanvas2 = document.querySelector('#imageCanvas2');
			let img = new Image();
			img.src = URL.createObjectURL(fileInput.files[0]);
			img.onload = function(){
				imageCanvas2.width = img.width;
				imageCanvas2.height = img.height;
				let ctxt= imageCanvas2.getContext("2d");
				ctxt.drawImage(img, 0, 0);
				let imageData = ctxt.getImageData(0,0,imageCanvas2.width,imageCanvas2.height);
				const pixelData = imageData.data;
				const data_wali_array = [];
				for(let i=0;i<pixelData.length;i++){
					data_wali_array.push((((pixelData[i]&2)!=0)?1:0));
					data_wali_array.push(pixelData[i]&1);
				}
				console.log(data_wali_array);
				let ans="";
				let x = 0;
				let flag=1;
				let count=0;
				for(let i=0;i<data_wali_array.length;i++) {
					let a=1;
					console.log("hemlo");
					if(data_wali_array[i]==1){
						a<<=(7-i%8);
						x+=a;
					}
					if(i%8===7){
						count++;
						if(String.fromCharCode(x)==='\0'){
							break;
						}
						x%=128;
						ans+=String.fromCharCode(x);
						x=0;
					}
					if(ans.length===5 &&  ans!=="Valid") {
						document.querySelector('.extracted-item').value = "";
						document.querySelector('.notice').style.display = "block";
						console.log("not encoded" + ans); 
						flag=0;
						break;
					}
				}
				if(flag) {
					document.querySelector('.notice').style.display = "none";
					document.querySelector('.extracted-item').value = ans.substring(6);
					console.log(ans);
				}
				console.log("decoded");
			}
			
		}
		else alert("select image file");
});
