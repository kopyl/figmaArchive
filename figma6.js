const selected = () => figma.currentPage.selection

class Archive {

    constructor() {
        this.id = null
        this.page = this.find()
        this.exists = Boolean(this.page)
        this.create()
        this.notEmpty = this.page.findChild(e => e)
        this.placeholderNode = this.createPlaceholderNode()
    }

    find() {
        const archive = figma.root.findChild(
            e => e.type == "PAGE" && e.name == "Archive"
        )
        if (archive) this.id = archive.id
        return archive
    }

    create() {
        if (this.exists) return
        this.page = figma.createPage()
        this.page.name = "Archive"
        this.id = this.page.id
    }
    
    createPlaceholderNode() {
    	/*
    	In case there were no layers in archive
    	It should have been better implemented
    	but there is no time for that,
    	and it works
    	so I'm leaving it as is
    	*/
    	if (this.notEmpty) return
    	const placeholderNode = figma.createRectangle()
        this.page.appendChild(placeholderNode)
    	return placeholderNode
    }
    
    removePlaceholder() {
    	if (!this.placeholderNode) return
    	this.placeholderNode.remove()
    }

}



const getBottomLayerOfArchive = () => {
	archive = new Archive().page
	children = [ ...archive.children]
	children.sort(function(a, b) {return a.y - b.y})
	bottomLayer = children.slice(-1)[0]
	return bottomLayer
}

const getRightLayerOfArchive = () => {
	archive = new Archive().page
	children = [ ...archive.children]
	children.sort(function(a, b) {return a.x - b.x})
	rightLayer = children.slice(-1)[0]
	return rightLayer
}

const getDateFromStr = (str) => {
	str = str.split("|").slice(-1)[0].split(" ").filter(el => el != "")
	let dateLayer = str[0]
	return dateLayer
}

const dateOfBottomLayerIsDifferent = () => {
	let dateAndTimeLayer = getRightLayerOfArchive().name
	let dateLayer = getDateFromStr(dateAndTimeLayer)
	let currentDate = getDateFromStr(getStrDate())
	return !( [currentDate, dateLayer].every((val, i, arr) => val == arr[0]) )
}

const getFurthestXLayerX = (layers) => {
	let biggestXLayerValue = Number.NEGATIVE_INFINITY
	let biggestXLayer = null
	for (const layer of layers) {
	    if ( layer.x > biggestXLayerValue ) {
	        biggestXLayerValue = layer.x
	        biggestXLayer = layer
	    }
	}
	return biggestXLayer.x
}

const getXCoordToPutNewDayLayer = () => {
	const dateAndTimeLayer = getRightLayerOfArchive()
	const layers = archive.findAll(
		layer => layer.name.includes(
			getDateFromStr(dateAndTimeLayer.name)
		)
	)
	const widths = layers.map(layer => layer.width)
	const maxWidth = Math.max(...widths)
	const furthestXLayerX = getFurthestXLayerX(layers)
	return furthestXLayerX + maxWidth + 500
}








const addListeners = () => {
	document.addEventListener("keydown", function(event) {
	    if (event.which == 8 && event.shiftKey && event.altKey) {
	    	if (
	    		// selected().length && selected().map((el) => el.type).every( (val, i, arr) => {l(val); return val === arr[0] && (val == "FRAME" && arr[0] == "FRAME")})
	    		selected().length
	    	) {
	    			const archive = new Archive
	    		     for (layer of selected()) {
	    		     	layer.name = layer.name + " | " + getStrDate()
	    		     	rightLayer = getRightLayerOfArchive()
	    		     	if (dateOfBottomLayerIsDifferent() ) {
	    		     		archive.page.appendChild(layer)
		    		     	layer.x = getXCoordToPutNewDayLayer()
		    		     	layer.y = 5915
	    		     	} else {
	    		     		archive.page.appendChild(layer)
		    		     	layer.x = rightLayer.x
		    		     	layer.y = rightLayer.y + rightLayer.height + 200
	    		     	}
	    		     }
	    		    archive.removePlaceholder()
	    		    /*^ in case there were no layers in archive */
			     	figma.currentPage.selection = []
	     
	        }
	    	}
	});
}




const getFigma = (timer) => {
	try {
		console.log(figma, timer)
		addListeners()
		clearInterval(timer)
	} catch{console.log(222)}
}

const timer = setInterval(() => {getFigma(timer)}, 200 )
