const getFigma = (timer) => {
	try {
		console.log(figma, timer)
		clearInterval(timer)
	} catch{console.log(222)}
}

const timer = setInterval(() => {getFigma(timer)}, 200 )
