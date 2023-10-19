// Update toggle button text based on current whitelist status
async function updateToggleText() {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    let domain = new URL(tab.url).hostname;

    chrome.storage.local.get(['whitelist'], (result) => {
        let whitelist = result.whitelist || [];
        if (whitelist.includes(domain)) {
            document.querySelector('#status').innerHTML = '<br><span style="font-weight: bold; color: red; font-size:20px;">Clock\'s running!</span><br><br><img src="images/dynamite.webp" style="width:200px; height:200px;" /><br>';
            document.querySelector('#toggle').innerText = 'Disable';
            document.querySelector('#toggle').style.backgroundColor = '#fb4949';
            document.body.style.backgroundColor = '#fff9f9';
        } else {
            document.querySelector('#status').innerHTML = '<br><span style="font-weight: bold; color: green; font-size:20px;">Browse away!</span><br><br><img src="images/corgi.png" style="width:200px; height:200px;" /><br>';
            document.querySelector('#toggle').innerText = 'Enable';
            document.querySelector('#toggle').style.backgroundColor = '#04AA6D';
            document.body.style.backgroundColor = '#f9fff9';
        }
    });
}

// Event listener for the toggle button click
document.getElementById('toggle').addEventListener('click', async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    let domain = new URL(tab.url).hostname;

    chrome.storage.local.get(['whitelist'], (result) => {
        let whitelist = result.whitelist || [];
        if (whitelist.includes(domain)) {
            whitelist = whitelist.filter(d => d !== domain);
        } else {
            whitelist.push(domain);
        }
        chrome.storage.local.set({ whitelist }, () => {
            updateToggleText();
            chrome.tabs.reload(tab.id);
        });
    });
});

// Event listener for the reset button click
document.getElementById('reset').addEventListener('click', async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    let domain = new URL(tab.url).hostname;

    chrome.storage.local.get(['domainSeconds'], (result) => {
        let domainSeconds = result.domainSeconds || {};
        domainSeconds[domain] = 65; // reset the seconds for the domain to 65
        chrome.storage.local.set({ domainSeconds }, () => {
            chrome.tabs.reload(tab.id);
        });
    });
});


// Initialize toggle text when popup opened
updateToggleText();