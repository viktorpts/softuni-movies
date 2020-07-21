const elements = {
    info: document.querySelector('#infoBox'),
    error: document.querySelector('#errorBox'),
    loading: document.querySelector('#loadingBox')
};

elements.info.addEventListener('click', hideInfo);
elements.error.addEventListener('click', hideError);

export function showInfo(message) {
    elements.info.children[0].textContent = message;
    elements.info.style.display = 'block';

    setTimeout(hideInfo, 3000);
}

export function showError(message) {
    elements.error.children[0].textContent = message;
    elements.error.style.display = 'block';
}

let requests = 0;

export function beginRequest() {
    requests++;
    elements.loading.style.display = 'block';
}

export function endRequest() {
    requests--;
    if (requests === 0) {
        elements.loading.style.display = 'none';
    }
}

function hideInfo() {
    elements.info.style.display = 'none';
}

function hideError() {
    elements.error.style.display = 'none';
}