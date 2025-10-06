function switchTab(tabId) {
  document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
  document.getElementById(tabId).classList.add('active');
}

let cachedData = null;

async function fetchAllItems() {
  if (!cachedData) {
    const response = await fetch('https://raw.githubusercontent.com/epicisgood/GAG-Updater/refs/heads/main/items.json');
    cachedData = await response.json();
  }
  return cachedData;
}

async function getItems(category) {
  const data = await fetchAllItems();
  return data[category].map(item => item.name);
}

async function getItemJSON(category) {
  const data = await fetchAllItems();
  return data[category];
}

async function onSaveClick() {
  const seedItems = await getItems("Seeds");
  const seed2Items = await getItems("Seeds2");
  const gearItems = await getItems("Gears");
  const EggItems = await getItems("Eggs");
  const Egg2Items = await getItems("Eggs2");
  const GearCraftingItems = await getItems("GearCrafting");
  const SeedCraftingItems = await getItems("SeedCrafting");
  const EvoSeedsItems = await getItems("EvoSeeds");
  
  // Hardcoded Season Pass items
const SeasonPassItems = ["Prime Crate", "Egg Yolk Mat", "Silver Fertilizer", "Prime Seed Pack", "Season Pass Levelup Lollipop", "Grow All", "Naval Wort"];

  seedItems.push("Seeds");
  seed2Items.push("Seeds2");
  gearItems.push("Gears");
  EggItems.push("Eggs");
  Egg2Items.push("Eggs2");
  GearCraftingItems.push("GearCrafting");
  SeedCraftingItems.push("SeedCrafting");
  EvoSeedsItems.push("EvoSeeds");
  SeasonPassItems.push("SeasonPass");

  const cfg = {
    url: document.getElementById('url').value,
    discordID: document.getElementById('discordID').value,
    VipLink: document.getElementById('VipLink').value,
    TravelingMerchant: +document.getElementById('TravelingMerchant').checked,
    Cosmetics: +document.getElementById('Cosmetics').checked,
    CookingEvent: +document.getElementById('CookingEvent').checked,
    SearchList: document.getElementById('SearchList').value,
    CookingTime: document.getElementById('CookingTime').value,
    SeasonPass: +document.getElementById('SeasonPass').checked,
    seedItems: {},
    seed2Items: {},
    gearItems: {},
    EggItems: {},
    Egg2Items: {},
    GearCraftingItems: {},
    SeedCraftingItems: {},
    EvoSeedsItems: {},
    SeasonPassItems: {},
  };

  const allLists = {
    seedItems,
    seed2Items,
    gearItems,
    EggItems,
    Egg2Items,
    GearCraftingItems,
    SeedCraftingItems,
    EvoSeedsItems,
    SeasonPassItems,
  };

  for (const [listName, items] of Object.entries(allLists)) {
    items.forEach(name => {
      const key = name.replace(/\s+/g, '');
      const element = document.getElementById(key);
      if (element) {
        cfg[listName][name] = element.checked;
      }
    });
  }

  ahk.Save.Func(JSON.stringify(cfg));
  console.log(cfg);
}

function applySettings(a) {
    const s = a.data;
    console.log("Applying settings with these settings: ", s);

    document.getElementById('url').value = s.url;
    document.getElementById('discordID').value = s.discordID;
    document.getElementById('VipLink').value = s.VipLink;
    document.getElementById('Cosmetics').checked = !!+s.Cosmetics
    document.getElementById('TravelingMerchant').checked = !!+s.TravelingMerchant
    document.getElementById('CookingEvent').checked = !!+s.CookingEvent
    document.getElementById('SearchList').value = s.SearchList
    document.getElementById('CookingTime').value = s.CookingTime
    document.getElementById('SeasonPass').checked = !!+s.SeasonPass

    const allItems = {
      SeedItems: s.SeedItems,
      Seed2Items: s.Seed2Items,
      GearItems: s.GearItems,
      EggItems: s.EggItems,
      Egg2Items: s.Egg2Items,
      GearCraftingItems: s.GearCraftingItems,
      SeedCraftingItems: s.SeedCraftingItems,
      EvoSeedsItems: s.EvoSeedsItems,
      SeasonPassItems: s.SeasonPassItems,
    };

    for (const [listName, itemsMap] of Object.entries(allItems)) {
      for (const [itemName, itemValue] of Object.entries(itemsMap)) {
        const formattedItem = itemName.replace(/\s+/g, '');
        const element = document.getElementById(formattedItem);
        if (element) {
          element.checked = !!+itemValue;
          console.log(element, itemValue)
        }
      }
    }
}

async function AddHtml() {
  const categories = ["Seeds", "Seeds2", "Gears", "Eggs","Eggs2", "GearCrafting", "SeedCrafting", "EvoSeeds"];

  for (const category of categories) {
    const items = await getItemJSON(category);
    const rewardGrid = document.querySelector(`#${category}Grid`);
    if (!rewardGrid) continue;

    for (const item of items) {
      const sanitizedName = item.name.replace(/\s+/g, '');
      const imgPath = item.image || `../../images/${category}/${item.name}.webp`;
      const inputType = (category === "GearCrafting" || category === "SeedCrafting") ? "radio" : "checkbox";
      const inputName = (inputType === "radio") ? `name="${category}"` : "";

      const div = document.createElement("div");
      div.className = "reward-box";
      div.innerHTML = `
        <div class="reward-header">
          <img src="${imgPath}" style="width: 32.5px; height: 32.5px; margin-right: 3px; vertical-align: middle;" onerror="this.src='../../images/Other/Placeholder.webp'">
          <span>${item.name}</span>
        </div>
        <div class="reward-options">
          <label><input type="${inputType}" id="${sanitizedName}" ${inputName}>Claim</label>
        </div>
      `;
      rewardGrid.appendChild(div);
    }
  }

  // Special handling for Season Pass (hardcoded items)
  const seasonPassItems = [
    {name: "Prime Crate"},
    {name: "Egg Yolk Mat"},
    {name: "Silver Fertilizer"},
    {name: "Prime Seed Pack"},
    {name: "Season Pass Levelup Lollipop"},
    {name: "Grow All"},
    {name: "Naval Wort"}
  ];

  const seasonPassGrid = document.querySelector('#SeasonPassGrid');
  if (seasonPassGrid) {
    for (const item of seasonPassItems) {
      const sanitizedName = item.name.replace(/\s+/g, '');
      const div = document.createElement("div");
      div.className = "reward-box";
      div.innerHTML = `
        <div class="reward-header">
          <span>${item.name}</span>
        </div>
        <div class="reward-options">
          <label><input type="checkbox" id="${sanitizedName}">Claim</label>
        </div>
      `;
      seasonPassGrid.appendChild(div);
    }
  }
}

document.addEventListener("DOMContentLoaded", async () => {
    await AddHtml()
    ahk.ReadSettings.Func()
    window.chrome.webview.addEventListener('message', applySettings);
})

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".SelectAll").forEach(selectAllCheckbox => {
    selectAllCheckbox.addEventListener("change", () => {
      const rewardGrid = selectAllCheckbox.closest(".rewards-grid");
      if (!rewardGrid) return;

      const checkboxes = rewardGrid.querySelectorAll("input[type='checkbox']");

      checkboxes.forEach(cb => {
        const isSelectAll = cb.classList.contains("SelectAll");
        const isEnableCheckbox = ["Seeds", "Seeds2", "Gears", "Eggs","Eggs2", "EvoSeeds", "SeasonPass"].includes(cb.id);
        if (!isSelectAll && !isEnableCheckbox) {
          cb.checked = selectAllCheckbox.checked;
        }
      });
    });
  });
});

// HTML cool stuff
document.querySelectorAll('.tabs button').forEach(button => {
  button.addEventListener('click', function() {
    document.querySelectorAll('.tabs button').forEach(btn => {
      btn.classList.remove('tab-button-active');
    });
    this.classList.add('tab-button-active');
  });
});

document.addEventListener('DOMContentLoaded', function() {
  document.querySelector('.tabs button').classList.add('tab-button-active');
});