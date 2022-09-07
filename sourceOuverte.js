document.writeln('sourceOuverte.js</br>');



function appendError() {
	console.log("erreur d'append")
}

function initSegmentAppended() {
	console.log("initSegment appendé")
	sourceBuffer.removeEventListener("update",initSegmentAppended);
	sourceBuffer.addEventListener("update",mediaSegmentAppended);
	seg = 0;
	sourceBuffer.appendBuffer(segments[seg]);
}

function mediaSegmentAppended() {
	console.log("segment media "+seg+" appendé")
	seg = seg + 1;
	if (seg < stopSegment)
		sourceBuffer.appendBuffer(segments[seg]);
}-

function sourceFermee() {
	console.log("source fermée");
}

function sourceTerminee() {
	console.log("source terminée");
}

function updateEnd() {
	console.log('updateend')
}

document.writeln('fin de sourceOuverte.js</br>');