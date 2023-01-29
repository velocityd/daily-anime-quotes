setBg();

let port = chrome.extension.connect({
	name: "connection",
});

port.postMessage("hi background");
port.onMessage.addListener(async (msg) => {
	console.log("message recieved ", msg);
	await handleFront(msg)
	setTimeout(() => {
		document.querySelector(".quote").style.animationName = "textAppear";
	}, 2000);
})

const handleFront = (quote) => {
	let quoteTitle = document.querySelector(".quote-text");
	let quoteAuthor = document.querySelector(".quote-author");

	quoteTitle.innerText = quote["quote"];
	quoteAuthor.innerText = quote["character"];
	console.log("successfully done...");
}

function setBg() {
	const hours = (new Date()).getHours();
	let imgName;
	if(hours > 6 && hours < 18) {
		imgName = "bgDay.jpg";
		document.querySelector(".quote").classList.add("day");
		document.querySelector(".time").classList.add("day");
	} else {
		imgName = "bgNight.jpg";
		document.querySelector(".quote").classList.add("night");
		document.querySelector(".time").classList.add("night");
	}
	let imgUrl = chrome.runtime.getURL(`./images/${imgName}`);
	document.querySelector(".container").style.backgroundImage = `url(${imgUrl})`;
	console.log("image setted");
}

// Setting the time
const setTime = () => {
	let time = new Date();
	document.querySelector(".time").innerText = `${time.getHours()}:${time.getMinutes()}`;
}

setTime();