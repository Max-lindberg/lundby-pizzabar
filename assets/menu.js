/* Menukort 2024 – kontrolleret mod dagensmenu.dk/lundby-pizza (menukort-scan i høj opløsning).
   Priser i kr. Pizza-størrelser: alm, deep, fam. */
window.MENU = {
  offers: [
    { id: "kebabbox", name: "Kebab Box", desc: "med kebab eller kylling", price: 50 },
    { id: "burgermenu", name: "Burger Menu", desc: "Big Burger, lille pommes frites, salatmayonnaise, 0,33 l sodavand", price: 115 },
    { id: "hjburgermenu", name: "Hjemmelavet Burger Menu", desc: "Klassisk Burger, lille pommes frites, salatmayonnaise, 0,33 l sodavand", price: 125 },
    { id: "kebabmenu", name: "Kebab Menu", desc: "Pitabrød med kebab, lille pommes frites, salatmayonnaise, 0,33 l sodavand", price: 95 }
  ],
  categories: [
    {
      id: "pizza", nav: "Pizza", title: "Pizza", note: "Alle pizzaer er med tomatsauce og ost", sizes: ["alm", "deep", "fam"], pizza: true,
      items: [
        ["1", "Margherita", "", [72, 102, 128]],
        ["2", "Vesuvio", "skinke", [78, 108, 140]],
        ["3", "Capricciosa", "skinke, champignon", [82, 112, 148]],
        ["4", "Hawaii", "skinke, ananas", [82, 112, 148]],
        ["5", "Pepperoni", "skinke, pepperoni", [86, 116, 156]],
        ["6", "Italiana", "kødsauce, løg", [86, 116, 156]],
        ["7", "Lundby Flyer", "kylling, friske tomater, paprika, hvidløg, chili", [90, 120, 164]],
        ["8", "Kristo", "kartofler, spinat, pesto", [99, 129, 182]],
        ["9", "Zelal", "kebab, kylling", [96, 126, 176]],
        ["10", "Tun", "tun, løg, champignon", [93, 123, 170]],
        ["11", "Juventus", "pepperoni, champignon, paprika", [88, 118, 160]],
        ["12", "Roma", "pepperoni", [78, 108, 140]],
        ["13", "Cocktailpølser", "skinke, bacon, cocktailpølser", [98, 128, 180]],
        ["14", "Milan", "champignon, kødboller, jalapenos", [86, 116, 156]],
        ["15", "Torino", "champignon, kebab, løg, paprika", [90, 120, 164]],
        ["16", "Køng", "kylling, løg, champignon, paprika", [90, 120, 164]],
        ["17", "Viking", "kebab, gorgonzola, paprika", [93, 123, 170]],
        ["18", "Apollo", "champignon, kebab, gorgonzola, løg", [96, 126, 176]],
        ["19", "Tina", "champignon, kylling, bacon", [96, 126, 176]],
        ["20", "Eva", "pepperoni, bacon, gorgonzola", [96, 126, 176]],
        ["21", "Lov", "skinke, pepperoni, pølser", [96, 126, 176]],
        ["22", "Halis", "champignon, kebab, løg, bearnaise", [93, 123, 170]],
        ["23", "Rüya", "kylling, cocktailpølser, bacon", [98, 128, 180]],
        ["24", "Oscar", "pepperoni, skinke, kebab, bacon", [105, 135, 194]],
        ["25", "Fantasia", "pepperoni, kødboller, jalapenos", [93, 123, 170]],
        ["26", "Samos", "skinke, pepperoni, bacon", [98, 128, 180]],
        ["27", "Venus", "pepperoni, gorgonzola, løg", [93, 123, 170]],
        ["28", "Frederik", "champignon, skinke, kebab, bearnaise", [98, 128, 180]]
      ]
    },
    {
      id: "mexicansk", nav: "Mexicansk", title: "Mexicansk pizza", note: "Alle pizzaer er med tomatsauce og ost", sizes: ["alm", "deep", "fam"], pizza: true,
      items: [
        ["29", "Mexicana", "pepperoni, kebab, jalapenos, løg, tacosauce", [103, 133, 190]],
        ["30", "Køng", "kebab, jalapenos, paprika, hvidløg, tacosauce", [103, 133, 190]],
        ["31", "Adar", "skinke, champignon, pepperoni, jalapenos, tacosauce", [103, 133, 190]],
        ["32", "Azra", "kebab, kylling, jalapenos, paprika, chili, hvidløg, tacosauce", [103, 133, 190]]
      ]
    },
    {
      id: "salatpizza", nav: "Salatpizza", title: "Salatpizza", note: "Alle pizzaer er med tomatsauce, ost, salat og dressing", sizes: ["alm", "deep", "fam"], pizza: true, salad: true,
      items: [
        ["33", "Sinan", "kebab", [89, 118, 160]],
        ["34", "Florida", "skinke", [89, 118, 160]],
        ["35", "Kylling", "kylling", [89, 118, 160]],
        ["36", "Pepperoni", "pepperoni", [89, 118, 160]],
        ["37", "Kødboller", "kødboller", [89, 118, 160]]
      ]
    },
    {
      id: "indbagt", nav: "Indbagt", title: "Indbagt pizza", note: "Alle pizzaer er med tomatsauce og ost",
      items: [
        ["38", "Calzone", "skinke", [80]],
        ["39", "Mix", "skinke, kylling, kebab", [99]],
        ["40", "Spaghetti", "spaghetti med kødsauce", [90]]
      ]
    },
    {
      id: "ekstra", nav: "Ekstra fyld", title: "Ekstra tilbehør", note: "Pris pr. ekstra fyld på alm. / familiepizza", sizes: ["alm", "fam"], noAdd: true,
      items: [
        ["", "Grønt & frugt", "paprika, løg, oliven, ananas, jalapenos", [15, 20]],
        ["", "Ost & grønt", "ost, champignon, artiskok, spinat, fetaost, salat & dressing", [17, 25]],
        ["", "Kød & gorgonzola", "skinke, bacon, pepperoni, kylling, kødsauce, gorgonzola, kebab, kødboller", [23, 30]],
        ["", "Dressing i bæger", "remoulade, ketchup, tomatsauce, bearnaise, salatmayonnaise, chili, hvidløg", [10]]
      ]
    },
    {
      id: "alacarte", nav: "À la carte", title: "À la carte",
      items: [
        ["41", "Kebab Ret", "2 stk. pitabrød, pommes frites, salat, dressing", [99]],
        ["42", "Lundby Bøf", "2 stk. med pommes frites, salat, dressing, bearnaise", [105]],
        ["43", "½ Kylling", "med pommes frites, salat, dressing, remoulade", [95]],
        ["43A", "½ Kylling", "uden tilbehør", [70]],
        ["44", "Chicken Dipper", "10 stk. med pommes frites, salatmayonnaise, salat og dressing", [95]],
        ["44A", "Chicken Dipper", "10 stk. uden tilbehør", [70]],
        ["46", "Fiskefilet", "2 stk. med remoulade, pommes frites, salat og dressing", [95]]
      ]
    },
    {
      id: "salat", nav: "Salat", title: "Salat", note: "Alle er med pitabrød, salat og dressing",
      items: [
        ["47", "Tun Salat", "", [55]],
        ["48", "Kylling Salat", "", [55]],
        ["49", "Græsk Salat", "med fetaost, oliven", [55]],
        ["50", "Kebab Salat", "", [55]]
      ]
    },
    {
      id: "pita", nav: "Pitabrød", title: "Pitabrød", note: "Med salat og dressing. Vælg hvidløgs-, thousand island- eller creme fraiche-dressing",
      items: [
        ["51", "Lundby Bøf", "", [45]],
        ["52", "Kebab", "", [35]],
        ["53", "Kylling", "", [35]],
        ["54", "Falafel", "vegetar", [35]]
      ]
    },
    {
      id: "burger", nav: "Burger", title: "Burger", note: "Alle burgere er med salat, ketchup, tomat og agurk",
      items: [
        ["55", "Big Burger", "", [52]],
        ["56", "Kylling Burger", "", [52]],
        ["57", "Cheese Burger", "", [55]],
        ["58", "Bacon Burger", "", [55]],
        ["59", "Dobbelt Burger", "", [64]],
        ["60", "Dynamit Burger", "med bacon, ost", [60]],
        ["", "Ekstra ost / bacon", "", [8]]
      ]
    },
    {
      id: "okse", nav: "Okseburger", title: "Okseburger", note: "Alle burgere er med salat, ketchup, tomat og agurk",
      items: [
        ["62", "Klassisk Okse", "", [65]],
        ["63", "Cheese Okse", "", [68]],
        ["64", "Bacon Okse", "", [68]],
        ["65", "Dobbelt Okse", "", [80]],
        ["66", "Bacon Cheese Okse", "", [73]],
        ["", "Ekstra ost / bacon", "", [8]]
      ]
    },
    {
      id: "sandwich", nav: "Pizzasandwich", title: "Kæmpe pizzasandwich", note: "Alle med ost, salat og dressing",
      items: [
        ["67", "Kylling & Bacon", "", [72]],
        ["68", "Lundby Bøf", "", [67]],
        ["69", "Kebab", "", [67]],
        ["70", "Kylling", "", [67]],
        ["71", "Skinke", "", [67]],
        ["72", "Tun", "", [67]],
        ["73", "Pepperoni", "", [67]],
        ["74", "Falafel", "vegetar", [67]]
      ]
    },
    {
      id: "durum", nav: "Dürüm", title: "Hjemmelavet dürüm rulle", note: "Alle med salat og dressing",
      items: [
        ["75", "Lundby Bøf", "", [75]],
        ["76", "Kebab", "", [75]],
        ["77", "Kylling", "", [75]],
        ["78", "Skinke", "", [75]],
        ["79", "Tun", "", [75]],
        ["80", "Falafel", "vegetar", [75]]
      ]
    },
    {
      id: "boern", nav: "Børnemenu", title: "Børnemenu",
      items: [
        ["81", "Fiskefilet", "1 stk. med pommes frites, remoulade", [68]],
        ["82", "Pizza", "tomatsauce, ost, skinke", [63]],
        ["83", "Pizza", "tomatsauce, ost, kødsauce", [63]],
        ["84", "Pizza", "tomatsauce, ost, pepperoni", [63]],
        ["85", "Pizza", "tomatsauce, ost, cocktailpølser", [63]],
        ["85A", "Chicken Dipper", "5 stk. med pommes frites, mayonnaise", [68]]
      ]
    },
    {
      id: "diverse", nav: "Diverse", title: "Diverse",
      items: [
        ["86", "Pommes frites", "lille", [40]],
        ["87", "Pommes frites", "stor", [45]],
        ["88", "Hvidløgsbrød", "med hvidløg, ost, tomatsauce", [60]]
      ]
    },
    {
      id: "drikke", nav: "Drikke", title: "Drikkevarer", note: "Coca-Cola, Fanta, Cacao",
      items: [
        ["", "Sodavand", "1,5 l", [40]],
        ["", "Sodavand", "0,5 l", [25]],
        ["", "Sodavand", "0,33 l dåse", [18]],
        ["", "Kildevand", "", [15]]
      ]
    }
  ]
};
