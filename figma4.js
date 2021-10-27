const getFigma = (timer) => {
	alert("FUCK8")
	try {
		console.log(figma, timer)
		clearInterval(timer)
	} catch{console.log(222)}
}

const timer = setInterval(() => {getFigma(timer)}, 200 )
