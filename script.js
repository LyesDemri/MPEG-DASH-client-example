var segment;
var timeToFetch = 1;
var seg = 0;
var mediaSource = new MediaSource();
mediaSource.addEventListener('sourceopen',sourceOpen);
var sourceBuffer;
var video = document.getElementById("vivi");
video.src = URL.createObjectURL(mediaSource);
video.addEventListener("timeupdate",timeUpdate);

//these values are straight from the Media Presentation Description file
var qualities = ["1280_4M","768_1440K","512_640K"];
var bitrates = [4114301,1880897,1082580];
var quality = 0;
var oldQuality = 0;
var qualityChange = false;

var requestSendDate;
var requestReceiveDate;
var downloadRate;

function sourceOpen() {
	//put things in place
	var mediaSource = this;
	sourceBuffer = mediaSource.addSourceBuffer('video/mp4; codecs="avc1.42c01f');
	sourceBuffer.addEventListener('update',segmentAppended)
	//start main loop
	mainLoop();
}

function mainLoop() {
	if (seg == 0 || qualityChange)
	{
		URL = "https://dash.akamaized.net/dash264/TestCases/2c/qualcomm/1/ED_"+qualities[quality]+"_MPEG2_video_init.mp4";
		console.log("seg = "+seg+", qualityChange = "+qualityChange)
	}
	else
		URL = "https://dash.akamaized.net/dash264/TestCases/2c/qualcomm/1/ED_"+qualities[quality]+"_MPEG2_video_"+((seg-1)*24576)+".mp4";
	document.title = qualities[quality];
	var xhttp = new XMLHttpRequest();
	xhttp.open("GET", URL);
	xhttp.responseType = "arraybuffer";
	xhttp.onreadystatechange = saveSegment;
	requestSendDate = Date.now();
	xhttp.send();
}

function saveSegment() {
	if (this.status == 200 && this.readyState == 4)
	{
		requestReceiveDate = Date.now();
		segment = this.response;
		requestResponseTime = requestReceiveDate - requestSendDate
		downloadRate = (segment.byteLength*8)/(requestResponseTime/1000)
		console.log("Download Rate: "+downloadRate+" bps, request time: "+requestResponseTime/1000+" s")
		sourceBuffer.appendBuffer(segment);
	}
}

function segmentAppended() {
	if (qualityChange == false)
		seg = seg + 1;
	if (seg == 1 || qualityChange)
	{
		qualityChange = false;
		console.log("Segment Appended, seg = "+seg+", qualityChange = "+qualityChange)
		mainLoop();
	}
}

function timeUpdate() {
	if (this.currentTime > timeToFetch) {
		quality = 0;
		for (var i = 0; i < qualities.length - 1; i++) {
			if (downloadRate < bitrates[i]) {
				quality = quality + 1;
			}
		}
		if (quality != oldQuality)
			qualityChange = true;
		oldQuality = quality
		console.log("chosen quality: "+qualities[quality]+"("+quality+")")
		timeToFetch = timeToFetch + 2;
		mainLoop();
	}
}