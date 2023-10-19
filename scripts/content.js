(function () {

    chrome.storage.local.get(['whitelist', 'domainSeconds'], (result) => {
        let currentDomain = window.location.hostname;

        // Check for whitelist and load seconds from storage or default to 65
        let seconds = result.domainSeconds && result.domainSeconds[currentDomain] ? result.domainSeconds[currentDomain] : 65;

        if (result.whitelist && result.whitelist.includes(currentDomain)) {
            // Create the bar element
            const bar = document.createElement('div');

            // Style the bar
            bar.style.position = 'fixed';
            bar.style.top = '0';
            bar.style.left = '0';
            bar.style.width = '100%';
            bar.style.height = '25px';
            bar.style.backgroundColor = 'rgba(0, 128, 0, 0.6)';  // Color and some transparency
            bar.style.color = 'white';
            bar.style.zIndex = '99999';  // Put on top
            bar.style.padding = '10px';
            bar.style.textAlign = 'center';
            bar.style.visibility = 'hidden';

            // Countdown
            bar.innerHTML = timeFormat(seconds);

            const timer = setInterval(function () {
                seconds--;

                // Save the current seconds value to chrome.storage.local
                const domainSeconds = result.domainSeconds || {};
                domainSeconds[currentDomain] = seconds;
                chrome.storage.local.set({ domainSeconds });

                bar.innerHTML = timeFormat(seconds);

                if (seconds <= 0) {
                    clearInterval(timer);
                    bar.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
                    bar.innerHTML = 'Get back to work!<br><br><img src="https://i.pinimg.com/originals/eb/66/11/eb66115ee08e165306ed41e7f8893648.jpg" />';
                    // window.open('https://i.pinimg.com/originals/eb/66/11/eb66115ee08e165306ed41e7f8893648.jpg', '_blank');
                    bar.style.visibility = 'visible';
                } else if (seconds < 30) {
                    bar.style.backgroundColor = 'rgba(255, 0, 0, 0.6)';
                    // document.body.style.filter = 'brightness(' + (seconds / 60) * 100 + '%)';
                    bar.style.height = 25 + 900 * (60 - seconds) / 60 + 'px';
                    bar.style.visibility = 'visible';
                } else if (seconds < 60) {
                    bar.style.backgroundColor = 'rgba(255, 160, 0, 0.7)';
                    // document.body.style.filter = 'brightness(' + (seconds / 60) * 100 + '%)';
                    bar.style.height = 25 + 900 * (60 - seconds) / 60 + 'px';
                    bar.style.visibility = 'visible';
                } else {
                    bar.style.visibility = 'visible';
                }
            }, 1000);

            // Insert the bar at the top of the body
            document.body.prepend(bar);
        }
    });

})();

function timeFormat(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`
}
