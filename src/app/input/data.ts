const onlineShops = [
  "Agora", "Ajkerdeal", "Amana big bazar", "Bangla shoppers", "Chaldal", "Daily Bazar", "Daily Shopping", "Daraz mart", "GOFRESH", "Grocery", "Jogaan", "Khaas Food", "Kintaini", "Meena bazar", "Meenaclick", "MudiiMart", "Othoba", "Paikaree.com.bd", "SobjiBazaar", "Shwapno", "Taja Bajar", "Unimart", "Uttara Kacha Bazaar"
]

export const products = [
  {
    id: 1,
    name: 'Rice',
    unit: 'kg',
    img: "rice.png",
    purchaseOption: ["Loose", "Packet", "Other"],
    categories: ["Miniket", "Nazirshall", "Paijam", "Sharna", "Lota", "Other"],
  },
  {
    id: 2,
    name: 'Flour',
    unit: 'kg',
    img: "flour.png",
    purchaseOption: ["Loose", "Packet", "Other"],
  },
  {
    id: 3,
    name: 'Lentil',
    unit: 'kg',
    img: "lentil.png",
    purchaseOption: ["Loose", "Packet", "Other"],
  },
  {
    id: 4,
    name: "Soybean Oil",
    unit: 'liter',
    img: "soybean.png",
    purchaseOption: ["Loose", "Bottle", "Other"],
  },
  {
    id: 5,
    name: "Salt",
    unit: 'kg',
    img: "salt.png",
    purchaseOption: ["Loose", "Packet", "Other"],
  },
  {
    id: 6,
    name: "Sugar",
    unit: 'kg',
    img: "sugar.png",
    purchaseOption: ["Loose", "Packet", "Other"],
    categories: ["Deshi", "Indian", "Pakisthani", "Other"]
  },
  {
    id: 7,
    name: "Egg",
    unit: '4 pieces',
    img: "eggs.png",
  },
  {
    id: 8,
    name: "Chicken",
    unit: 'kg',
    img: "chicken.png",
    purchaseOption: ["Live", "Processed with skin","Processed without skin", "Other"],
    categories: ["Broiler", "Layer", "Sonali", "Other"]
  },
  {
    id: 9,
    name: "Potato",
    unit: 'kg',
    img: "potato.png",
    categories: ["New Potato", "Old Potato", "Other"],
  },
  {
    id: 10,
    name: "Eggplant",
    unit: 'kg',
    img: "eggplant.png",
  },
  {
    id: 11,
    name: "Onion",
    unit: 'kg',
    img: "onion.png",
    categories: ["Deshi", "Indian", "Pakisthani", "Other"],
  }, 
  {
    id: 12,
    name: "Green Chilli",
    unit: 'kg',
    img: "green_chilli.png",
  }
].map(product => ({
  ...product,
  onlineShops: [...onlineShops]
}))



