/* Getting the value of the last quote save point(as a Date)
    Using a async function with a Promise.
    Promise returns the value through the resolve() function.
    
    Then we pass the key variable(quoteTimer) to the main() function which will keep 
    almost the entire code.
*/
const start = async () => {
    try {
        let promise = new Promise((resolve, reject) => {
            chrome.storage.sync.get("date", (data) => resolve(data));
        });

        // const quoteTimer = await promise.then((data) => { return new Date(parseInt(data["date"])) });
        const quoteTimer = await promise.then((data) => { return data; })

        if (quoteTimer["date"] !== undefined) {
            console.log("hehehehe", quoteTimer["date"]);
            return quoteTimer;
        } else {
            console.log("it IS undefined");
            await chrome.storage.sync.set({
                "date": (new Date()).getTime(),
                "quote": JSON.stringify(await getQuote())
            });
        }

    } catch (err) {
        console.error(err);
    }
}

const oldQuote = async () => {
    try {
        let promise = new Promise((resolve, reject) => {
            chrome.storage.sync.get("quote", (data) => resolve(data));
        });

        const oQuote = await promise
            .then((data) => { return JSON.parse(data["quote"]) })
            .catch((err) => console.log(err));
        return oQuote;
    } catch (err) {
        console.error(err);
    }
}


// Getting the content through fetch
const getQuote = async () => {
    try {
        let quote;
        await fetch("https://animechan.vercel.app/api/random")
            .then(resp => resp.json())
            .then(data => { quote = data })
            .catch(err => console.error(err));
        console.log("new quote", quote);
        return quote;
    } catch (err) {
        console.error(err);
    }
}

const handleQuote = () => {
    let newQuote = "12";
    try {
        chrome.extension.onConnect.addListener(async (port) => {
            console.log("Connected");
            const quoteTimer = await start();
            let dayDifference;
            if(quoteTimer !== undefined) {
                dayDifference = ((new Date()).getTime() - quoteTimer["date"]) / (1000 * 3600 * 24);
            } else {
                dayDifference = 0;
            }
            
            // console.log("sdsd", dayDifference, (new Date().getTime()), quoteTimer["date"]);
            if (dayDifference >= 1) {
                newQuote = await getQuote();
                chrome.storage.sync.set({
                    "date": (new Date).getTime(),
                    "quote": JSON.stringify(await getQuote())
                });
                console.log("new quote sent", newQuote);
            } else {
                newQuote = await oldQuote();
                console.log("old quote sent", newQuote);
            }
            port.postMessage(newQuote);
        });
    } catch (err) {
        console.error(err);
    }
}


// Main function

const main = async () => {
    console.log("wokrd");
    try {
        handleQuote();
    } catch (err) {
        console.error(err);
    }
}

main();
