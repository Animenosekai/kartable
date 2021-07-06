let lastHref = null;

async function log(message) {
    console.timeLog("Kartable Extension Execution")
    console.log("[debug] %c" + message, "color: #30cfff;")
}

function isKartableLesson() {
    let matches = window.location.href.match(/https:\/\/www\.kartable\.fr\/ressources\/([a-z0-9\-])+\/cours\/([a-z0-9\-])+\/([0-9])+/gi)
    return (matches && matches.length > 0)
}

function core() {
    console.time("Kartable Extension Execution")
    console.groupCollapsed("Kartable Extension")
    if (isKartableLesson()) {
        // delete cookies
        log("Deleting Cookies")
        document.cookie.split(";").forEach(function(c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); });
        
        // delete localStorage
        log("Clearing LocalStorage")
        window.localStorage.clear()
        
        // delete sessionStorage
        log("Clearing SessionStorage")
        window.sessionStorage.clear()
        
        // remove banners
        log("Removing the banners")
        let tags = ["push-more-content", "cookie-banner", "cross-selling-ad"]
        tags.forEach((tag) => {
            try {
                document.getElementsByTagName(tag)[0].remove()
            } catch {
                console.warn("An error occured while removing the tag: " + tag)
            }
        })

        log("Editing the 'Premium' button")
        try {
            document.querySelector("body > kartable-app > ng-component > kartable-header > header > div > li:nth-child(2) > button").innerText = "Enjoy Premium"
        } catch {
            console.warn("[Kartable Extension] An error occured while modifying the premium button")
        }
        
        // remove the event listeners blocking copy and contextmenu
        log("Removing the Event Listeners blocking 'copy' and 'contextmenu'")
        let eventTypes = ["contextmenu", "copy"]
        eventTypes.forEach((type) => {
            try {
                window.addEventListener(type, function(event) {
                    event.stopImmediatePropagation();
                }, true);
            } catch {
                console.warn("[Kartable Extension] An error occured while stopping " + type + "'s propagation")
            }
        })

    } else {
        log("On Kartable but not in a lesson")
    }
    console.groupEnd()
    console.timeEnd("Kartable Extension Execution")
}

//window.addEventListener("load", core)
//window.addEventListener("popstate", core)


window.addEventListener("load", () => {
    setInterval(() => {
        if (window.location.href != lastHref) {
            core()
            lastHref = window.location.href
        }
    }, 50);
})
