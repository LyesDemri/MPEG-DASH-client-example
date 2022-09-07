function fetchData(URL)
{
	var xhttp = new XMLHttpRequest();
	xhttp.open("GET", URL);
	xhttp.responseType = "arraybuffer";
	xhttp.onreadystatechange = saveSegment;
	xhttp.send();
}

function saveSegment() {
	//cette fonction ramène les 10 premiers segments média
	if (this.status == 200 && this.readyState == 4)
	{
		if (seg == 0)	//seg = 0 pour le segment d'initialisation (uniquement)
			initSegment = this.response;
		else			//seg>0 pour les segments média
			segments[seg-1] = this.response;
		seg = seg + 1;	//on avance
		if (seg - 1 < stopSegment)
		{
			var xhttp = new XMLHttpRequest();
			xhttp.open("GET", "https://dash.akamaized.net/dash264/TestCases/2c/qualcomm/1/ED_512_640K_MPEG2_video_"+(seg-1)*24576+".mp4");
			xhttp.responseType = "arraybuffer";
			xhttp.onreadystatechange = saveSegment;
			xhttp.send();
		}
		else
		{
			dataFetched();
		}
	}
}

function fetchMoreData (URL) {
	var xhttp = new XMLHttpRequest();
	xhttp.open("GET", URL);
	xhttp.responseType = "arraybuffer";
	xhttp.onreadystatechange = saveMoreSegments;
	xhttp.send();
}

function saveMoreSegments() {
	if (this.status == 200 && this.readyState == 4)
	{
		segments[seg-1] = this.response;
		seg = seg + 1;	//on avance
		if (seg - 1 < stopSegment)
		{
			var xhttp = new XMLHttpRequest();
			xhttp.open("GET", "https://dash.akamaized.net/dash264/TestCases/2c/qualcomm/1/ED_512_640K_MPEG2_video_"+(seg-1)*24576+".mp4");
			xhttp.responseType = "arraybuffer";
			xhttp.onreadystatechange = saveMoreSegments;
			xhttp.send();
		}
		else
		{
			seg = seg - 11
			console.log("appending segment"+seg)
			sourceBuffer.appendBuffer(segments[seg]);
		}
	}
}