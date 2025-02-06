const itemsData = [
    { name: "Uncharted", rarity: "common", image: "img/AKuncharted.png", chance: 20, price: 5 },
    { name: "Elite Build", rarity: "common", image: "img/AKelitebuild.png", chance: 20, price: 8 },        
    { name: "Safari Mesh", rarity: "common", image: "img/AKsafarimesh.png", chance: 20, price: 6 },
    { name: "Ice Coaled", rarity: "uncommon", image: "img/AKicecoaled.png", chance: 20, price: 15 },
    { name: "Frontside Misty", rarity: "rare", image: "img/AKfrontsidemisty.png", chance: 10, price: 35 },
    { name: "Inheritence", rarity: "mythical", image: "img/AKinheritence.png", chance: 5, price: 85 },
    { name: "Case Hardened", rarity: "legendary", image: "img/AKcasehardened.png", chance: 3, price: 250 },
    { name: "Fire Serpent", rarity: "ancient", image: "img/AKfireserpent.png", chance: 1.5, price: 750 },
    { name: "Wild Lotus", rarity: "exotic", image: "img/AKwildlotus.png", chance: 0.5, price: 2500 }
];

const floatRanges = [
    { name: "Factory New", min: 0, max: 0.07 },
    { name: "Minimal Wear", min: 0.07, max: 0.15 },
    { name: "Field-Tested", min: 0.15, max: 0.37 },
    { name: "Well-Worn", min: 0.37, max: 0.45 },
    { name: "Battle-Scarred", min: 0.45, max: 1 }
];

const rarityColors = {
    common: 'gray',
    uncommon: 'green',
    rare: 'blue',
    mythical: 'purple',
    legendary: 'orange',
    ancient: 'red',
    exotic: 'gold'
};

const CASE_PRICE = 25; // Price to open the case
let balance = parseInt(localStorage.getItem('balance')) || 1000; // Get balance from localStorage or start with 1000

const caseElement = document.getElementById('case');
const itemsElement = document.getElementById('items');
const openCaseButton = document.getElementById('openCaseButton');
const showcaseElement = document.getElementById('showcase');
const showcaseName = document.getElementById('showcaseName');
const showcaseFloat = document.getElementById('showcaseFloat');
const showcaseImage = document.getElementById('showcaseImage');
const balanceElement = document.getElementById('balance');

// Hide the spinner before the first spin
caseElement.style.display = 'none';

// Update balance display
function updateBalanceDisplay() {
    balanceElement.textContent = `$${balance.toLocaleString()}`;
}

// Function to save balance to localStorage
function saveBalance() {
    localStorage.setItem('balance', balance);
}

function getRandomItem() {
    const totalChance = itemsData.reduce((sum, item) => sum + item.chance, 0);
    const random = Math.random() * totalChance;
    let cumulativeChance = 0;

    for (const item of itemsData) {
        cumulativeChance += item.chance;
        if (random < cumulativeChance) {
            return item;
        }
    }
}

function getRandomFloat() {
    return parseFloat(Math.random().toFixed(14));
}

function getFloatRange(floatValue) {
    return floatRanges.find(range => floatValue >= range.min && floatValue < range.max).name;
}

function createItems() {
    itemsElement.innerHTML = '';
    for (let i = 0; i < 50; i++) {
        const randomItem = getRandomItem();
        const itemElement = document.createElement('div');
        itemElement.className = `item rarity-${randomItem.rarity}`;
        itemElement.innerHTML = `<img src="${randomItem.image}" alt="${randomItem.name}">`;
        itemsElement.appendChild(itemElement);
    }
}

function openCase() {
    if (balance < CASE_PRICE) {
        alert("Insufficient funds to open case!");
        return;
    }

    balance -= CASE_PRICE;
    updateBalanceDisplay();
    saveBalance();
    
    openCaseButton.disabled = true;
    caseElement.style.display = 'block';
    createItems();
    itemsElement.style.transition = 'none';
    itemsElement.style.left = '0px';
    showcaseElement.style.display = 'none';

    const itemWidth = 125;
    const spinLength = itemWidth * 20;

    setTimeout(() => {
        itemsElement.style.transition = 'left 2s cubic-bezier(0.42, 0, 0.58, 1)';
        itemsElement.style.left = `-${spinLength}px`;

        setTimeout(() => {
            const caseRect = caseElement.getBoundingClientRect();
            const centerX = caseRect.left + caseRect.width / 2;

            let winningItem = null;
            for (let item of itemsElement.children) {
                const itemRect = item.getBoundingClientRect();
                if (itemRect.left <= centerX && itemRect.right >= centerX) {
                    winningItem = item;
                    break;
                }
            }

            if (winningItem) {
                const itemName = winningItem.querySelector('img').alt;
                const itemData = itemsData.find(item => item.name === itemName);
                const randomFloat = getRandomFloat();
                const floatRange = getFloatRange(randomFloat);

                showcaseName.textContent = `${itemData.name} (${floatRange})`;
                showcaseFloat.textContent = `Float: ${randomFloat.toFixed(14)}`;
                showcaseImage.src = itemData.image;
                document.getElementById('itemPrice').textContent = `$${itemData.price.toLocaleString()}`;
                showcaseElement.style.setProperty('--rarity-color', rarityColors[itemData.rarity]);
                showcaseElement.style.setProperty('--rarity-color-light', getLightColor(rarityColors[itemData.rarity]));
                showcaseElement.style.display = 'block';

                // Store current item data for sell/keep buttons
                showcaseElement.dataset.currentItemPrice = itemData.price;
            }
            openCaseButton.disabled = false;
        }, 2000);
    }, 50);
}

function sellItem() {
    const price = Number(showcaseElement.dataset.currentItemPrice);
    balance += price;
    updateBalanceDisplay();
    saveBalance();
    showcaseElement.style.display = 'none';
}

// Helper function to get a lighter shade of a color
function getLightColor(color) {
    switch (color) {
        case 'gray': return 'lightgray';
        case 'green': return 'lightgreen';
        case 'blue': return 'lightblue';
        case 'purple': return 'lavender';
        case 'orange': return 'moccasin';
        case 'red': return 'lightcoral';
        case 'gold': return 'lightgoldenrodyellow';
        default: return 'white';
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateBalanceDisplay();
});

openCaseButton.addEventListener('click', openCase);
document.getElementById('sellButton').addEventListener('click', sellItem);