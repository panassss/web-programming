const tabsContainer = document.querySelector('#tabs');
const tabs = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab-content');

const topLeft = document.querySelector('#top-left');
const topRight = document.querySelector('#top-right');
const bottomRight = document.querySelector('#bottom-right');
const bottomLeft = document.querySelector('#bottom-left');

const topLeftValue = document.querySelector('#top-left-value');
const topRightValue = document.querySelector('#top-right-value');
const bottomRightValue = document.querySelector('#bottom-right-value');
const bottomLeftValue = document.querySelector('#bottom-left-value');

const outlineWidthInput = document.querySelector('#outline-width-input');
const outlineWidthValue = document.querySelector('#outline-width-value');
const outlineStyleSelect = document.querySelector('#outline-style-select');

const preview = document.querySelector('#preview');
const previewButton = document.querySelector('#preview-button');
const coordinates = document.querySelector('#coordinates');
const cssCode = document.querySelector('#css-code');
const copyButton = document.querySelector('#copy-button');
const copyMessage = document.querySelector('#copy-message');

const presetForm = document.querySelector('#preset-form');
const presetName = document.querySelector('#preset-name');
const presetError = document.querySelector('#preset-error');
const scrollTopButton = document.querySelector('#scroll-top');

function hideTabs() {
    tabs.forEach(function (tab) {
        tab.classList.remove('active');
    });

    tabContents.forEach(function (content) {
        content.classList.remove('active');
    });
}

function showTab(tabName) {
    const activeTab = document.querySelector(`[data-tab="${tabName}"]`);
    const activeContent = document.querySelector(`[data-content="${tabName}"]`);

    if (activeTab && activeContent) {
        activeTab.classList.add('active');
        activeContent.classList.add('active');
    }
}

tabs.forEach(function (tab) {
    tab.addEventListener('click', function (event) {
        console.log('Подія:', event.type);
        console.log('Target:', event.target);
        console.log('CurrentTarget:', event.currentTarget);

        const tabName = event.currentTarget.dataset.tab;
        hideTabs();
        showTab(tabName);
    });
});

function updateCSS() {
    const tl = topLeft.value;
    const tr = topRight.value;
    const br = bottomRight.value;
    const bl = bottomLeft.value;

    topLeftValue.textContent = `${tl} px`;
    topRightValue.textContent = `${tr} px`;
    bottomRightValue.textContent = `${br} px`;
    bottomLeftValue.textContent = `${bl} px`;

    const borderRadiusValue = `${tl}px ${tr}px ${br}px ${bl}px`;
    preview.style.borderRadius = borderRadiusValue;

    const ow = outlineWidthInput.value;
    const os = outlineStyleSelect.value;

    outlineWidthValue.textContent = `${ow} px`;
    preview.style.outlineWidth = `${ow}px`;
    preview.style.outlineStyle = os;

    cssCode.value = `border-radius: ${borderRadiusValue};\noutline-width: ${ow}px;\noutline-style: ${os};`;
}

topLeft.addEventListener('input', updateCSS);
topRight.addEventListener('input', updateCSS);
bottomRight.addEventListener('input', updateCSS);
bottomLeft.addEventListener('input', updateCSS);

outlineWidthInput.addEventListener('input', updateCSS);
outlineStyleSelect.addEventListener('change', updateCSS);

presetName.addEventListener('focus', function () {
    presetName.classList.add('focused');
});

presetName.addEventListener('blur', function () {
    presetName.classList.remove('focused');

    if (presetName.value.trim() === '') {
        presetName.classList.add('error');
        presetError.textContent = 'Введіть назву пресета';
    } else {
        presetName.classList.remove('error');
        presetError.textContent = '';
    }
});

function handlePresetSubmit(event) {
    event.preventDefault();

    const name = presetName.value.trim();
    if (name === '') {
        presetName.classList.add('error');
        presetError.textContent = 'Введіть назву пресета';
        return;
    }

    console.log(`Пресет: ${name}`);
    console.log(cssCode.value);

    presetError.textContent = '';
    presetName.value = '';
}

presetForm.addEventListener('submit', handlePresetSubmit);

function handleKeyDown(event) {
    if (event.key === 'Escape') {
        topLeft.value = 0;
        topRight.value = 0;
        bottomRight.value = 0;
        bottomLeft.value = 0;
        updateCSS();
    }
}

document.addEventListener('keydown', handleKeyDown);

function copyCSS() {
    navigator.clipboard.writeText(cssCode.value).then(function () {
        copyMessage.textContent = 'CSS-код скопійовано';
        setTimeout(function () {
            copyMessage.textContent = '';
        }, 2000);
    });
}

copyButton.addEventListener('click', copyCSS);

preview.addEventListener('mousemove', function (event) {
    coordinates.textContent = `X: ${event.clientX}; Y: ${event.clientY}`;
});

window.addEventListener('scroll', function () {
    if (window.scrollY > 300) {
        scrollTopButton.classList.add('visible');
    } else {
        scrollTopButton.classList.remove('visible');
    }
});

scrollTopButton.addEventListener('click', function () {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

updateCSS();