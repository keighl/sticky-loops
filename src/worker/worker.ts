console.log('worker rgister')

onmessage = function (event) {
	console.log(event)

	// DO STUFF!!

	// @ts-ignore
	postMessage({})
}
