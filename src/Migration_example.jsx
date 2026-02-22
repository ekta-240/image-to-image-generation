import { db } from './firebase';
import { collection, addDoc } from 'firebase/firestore';

const furnitureLibrary = [ 
    
  // --- SEATING ---
  { id: 'sofa', name: 'Modern Sofa', category: 'Seating', price: 7055, image: '/assets/sofa.png', links: 'https://www.flipkart.com/chandrika-enterprises-contemporary-fabric-2-seater-sofa/p/itm5015be0c98c05' },
  { id: 'armchair', name: 'Armchair', category: 'Seating', price: 7989, image: '/assets/armchair.png', links: 'https://www.flipkart.com/chairtech-leatherette-office-adjustable-arm-chair/p/itm0b4b20678cea2' },
  { id: 'recliner', name: 'Leather Recliner', category: 'Seating', price: 10650, image: '/assets/recliner.png', links: 'https://www.flipkart.com/softland-fabric-manual-recliner/p/itm4d619e4bf79df?pid=RECHCGZNGSJTKXPG&lid=LSTRECHCGZNGSJTKXPG1IHIVM&marketplace=FLIPKART&q=recliner&store=wwe%2Fc3z%2Fgxy&srno=s_1_4&otracker=search&otracker1=search&fm=Search&iid=313e738a-8681-4299-b99a-599a8d899d8d.RECHCGZNGSJTKXPG.SEARCH&ppt=sp&ppn=sp&ssid=xlvfasjtzk0000001771673022308&qH=6d91c9d9daa1a3e9&ov_redirect=true&ov_redirect=true' },
  { id: 'bean_bag', name: 'Classic Bean Bag', category: 'Seating', price: 2538, image: '/assets/bean_bag.png', links: 'https://www.flipkart.com/furnon-4xl-bean-bag-cushion-footrest-all-filled-beans-ready-use-teardrop-filling/p/itmd907fc0cadb8d?pid=BEBHF4YJQYRH4VWZ&lid=LSTBEBHF4YJQYRH4VWZYJWQ1J&marketplace=FLIPKART&q=bean+bag&store=wwe%2F4n6%2Fzet&spotlightTagId=default_FkPickId_wwe%2F4n6%2Fzet&srno=s_1_3&otracker=search&otracker1=search&fm=Search&iid=d891b86c-9096-49ff-974a-d1a1d0f424e1.BEBHF4YJQYRH4VWZ.SEARCH&ppt=sp&ppn=sp&ssid=bstl07w33k0000001771673259155&qH=0cda1ce14618a372&ov_redirect=true&ov_redirect=true' },
  { id: 'bench', name: 'Entryway Bench', category: 'Seating', price: 5477, image: '/assets/bench.png', links: 'https://www.flipkart.com/gnanitha-fabric-2-seater/p/itm9c40d588c6ab6?pid=BENGFGSFDBD3MFWK&lid=LSTBENGFGSFDBD3MFWKURJLWY&marketplace=FLIPKART&q=bench&store=wwe%2Fq7b%2Fxsq&srno=s_1_5&otracker=search&otracker1=search&fm=Search&iid=100b4d27-9ec9-49ce-a327-eb4db9a9a670.BENGFGSFDBD3MFWK.SEARCH&ppt=sp&ppn=sp&ssid=i5zpl3mmr40000001771673423504&qH=1d28d258250876fb&ov_redirect=true&ov_redirect=true' },
  { id: 'stool', name: 'Bar Stool', category: 'Seating', price: 367, image: '/assets/stool.png', links: 'https://www.flipkart.com/lv-handmade-natural-bamboo-mudda-stool-beige-13-x-inch-outdoor-cafeteria/p/itm4feef3b3ddc16?pid=SLTH6T8UZ2UGHBDA&lid=LSTSLTH6T8UZ2UGHBDABA2RHY&marketplace=FLIPKART&q=stool&store=wwe%2Fy7b%2Fj3p&srno=s_1_2&otracker=search&otracker1=search&fm=Search&iid=en_fv-Se6FebiVp8qO_-gkx0oTJDTCZ_Nhl_FDBRpDg2NU0rFNMAVtOo6Y_XKquYO6Ta7yZNI2eFsXvfpwvSaaJmw%3D%3D&ppt=sp&ppn=sp&ssid=499izfzl7k0000001771673600206&qH=801f91a616647fdf&ov_redirect=true&ov_redirect=true' },
  { id: 'ottoman', name: 'Velvet Ottoman', category: 'Seating', price: 814, image: '/assets/ottoman.png', links: 'https://www.flipkart.com/floriva-solid-wood-standard-ottoman/p/itm409aa987e1615?pid=OTPHEJDV7NEWEEMH&lid=LSTOTPHEJDV7NEWEEMHUDGTSP&marketplace=FLIPKART&q=ottoman&store=wwe%2Fq7b%2Fhht&spotlightTagId=default_BestsellerId_wwe%2Fq7b%2Fhht&srno=s_1_4&otracker=search&otracker1=search&fm=Search&iid=1273f6d1-8bd6-4f22-9e88-38b73f192047.OTPHEJDV7NEWEEMH.SEARCH&ppt=sp&ppn=sp&ssid=no2iqbp89s0000001771673703284&qH=17ff830fc0d26b5d&ov_redirect=true&ov_redirect=true' },

  // --- TABLES ---
  { id: 'coffee_table', name: 'Coffee Table', category: 'Tables', price: 1499, image: '/assets/coffee_table.png', links: 'https://www.flipkart.com/online-decor-shoppee-aaira-crafts-round-modern-marble-design-coffee-table-living-room-engineered-wood/p/itma46992f9c71d1' },
  { id: 'side_table', name: 'Side Table', category: 'Tables', price: 4499, image: '/assets/side_table.png', links: 'https://www.flipkart.com/globia-creations-engineered-wood-bedside-table/p/itm7637d465b2713' },
  { id: 'nesting_tables', name: 'Nesting Tables', category: 'Tables', price: 2575, image: '/assets/nesting_tables.png', links: 'https://www.flipkart.com/douceur-furnitures-solid-wood-nesting-table/p/itm1a6893550e28d?pid=NTTGXZDJ5ARSPPE2&lid=LSTNTTGXZDJ5ARSPPE2KTKFRG&marketplace=FLIPKART&q=nesting+table&store=wwe%2Fki7%2Fvdf&srno=s_1_29&otracker=AS_QueryStore_OrganicAutoSuggest_1_8_na_na_na&otracker1=AS_QueryStore_OrganicAutoSuggest_1_8_na_na_na&fm=search-autosuggest&iid=987a74f7-8b55-4aca-afd1-0e8ccbf45525.NTTGXZDJ5ARSPPE2.SEARCH&ppt=sp&ppn=sp&ssid=ksd8eekm280000001771674444495&qH=4589aaed5f018738&ov_redirect=true&ov_redirect=true' },
  { id: 'console_table', name: 'Console Table', category: 'Tables', price: 871, image: '/assets/console_table.png', links: 'https://www.flipkart.com/monika-art-sheesham-wood-console-tables-living-room-furniture-home-decor-table-vintage-traditional-collection-standard-honey-finish-solid-side/p/itmcf7537e2b7311?pid=SITG2Y3TPS5ZH4RX&lid=LSTSITG2Y3TPS5ZH4RXCONHOO&marketplace=FLIPKART&q=console+table&store=wwe%2Fki7%2Fyso&srno=s_1_13&otracker=search&otracker1=search&fm=Search&iid=4b61aa67-5e8c-4dfa-a53d-f6aa762f2aaa.SITG2Y3TPS5ZH4RX.SEARCH&ppt=sp&ppn=sp&qH=7bcc0b17f3768699&ov_redirect=true&ov_redirect=true' },
  { id: 'end_table', name: 'Modern End Table', category: 'Tables', price: 400, image: '/assets/end_table.png', links: 'https://www.flipkart.com/uhud-crafts-uc-12-engineered-wood-end-table/p/itm12eb2ad3a607b?pid=SITHCHTKBJVUNX3E&lid=LSTSITHCHTKBJVUNX3EV2AKSZ&marketplace=FLIPKART&q=end+table&store=wwe%2Fki7%2Fyso&srno=s_1_1&otracker=search&otracker1=search&fm=Search&iid=en_24nm0CyZi6syOKBHEviRC_CI41pJ5Larz9t1yMxcRETd4E-if8F9w8_2CTmzdszIPRFpt8LarhfKX-fQ-xKmzQ%3D%3D&ppt=sp&ppn=sp&ssid=gv56dxkf9c0000001771674708474&qH=f29d2ad1d6bf1a7c&ov_redirect=true&ov_redirect=true' },
  { id: 'study_table', name: 'Foldable Study Table', category: 'Tables', price: 420, image: '/assets/study_table.png', links: 'https://www.flipkart.com/xalvirex-solid-wood-study-table/p/itm84f14871deb15?pid=OSTHK48AUQVGA7PM&lid=LSTOSTHK48AUQVGA7PMZ87QQP&marketplace=FLIPKART&q=study+table&store=wwe%2Fki7&srno=s_1_19&otracker=search&otracker1=search&fm=Search&iid=245a7534-88e9-4bb5-bd00-c228605bf99f.OSTHK48AUQVGA7PM.SEARCH&ppt=sp&ppn=sp&ssid=i8ep1wvlgw0000001771674807156&qH=b9c440e01d8e72a2&ov_redirect=true&ov_redirect=true' },

  // --- LIGHTING ---
  { id: 'floor_lamp', name: 'Floor Lamp', category: 'Lighting', price: 1399, image: '/assets/floor_lamp.png', links: 'https://www.flipkart.com/flipkart-perfect-homes-tripod-floor-lamp/p/itm437d3d5272cda' },
  { id: 'table_lamp', name: 'Table Lamp', category: 'Lighting', price: 436, image: '/assets/table_lamp.png', links: 'https://www.flipkart.com/homesake-retro-matt-metal-table-lamp-off-white-fabric-cone-bedroom-living-room-lamp/p/itm8dee2c642a3d7' },
  { id: 'pendant_light', name: 'Pendant Light', category: 'Lighting', price: 599, image: '/assets/pendant.png', links: 'https://www.flipkart.com/energia-3-milky-doom-hanging-luster-light-pendants-chandelier-ceiling-lamp/p/itme48b750644b6b?pid=CILGHGCFBVJGRESR&lid=LSTCILGHGCFBVJGRESRGMBZEY&marketplace=FLIPKART&q=pendant+light&store=jhg%2F6w8%2Frws&srno=s_1_5&otracker=search&otracker1=search&fm=Search&iid=546442b4-5c5f-4d4a-a9a7-4ac9a2709b5d.CILGHGCFBVJGRESR.SEARCH&ppt=sp&ppn=sp&ssid=0tcu6mpq2o0000001771732556122&qH=2a3cc601b838c6b2&ov_redirect=true&ov_redirect=true' },
  { id: 'wall_sconce', name: 'Modern Sconce', category: 'Lighting', price: 899, image: '/assets/sconce.png', links: 'https://www.flipkart.com/prop-up-wallchiere-wall-lamp-without-bulb/p/itm2c45e7d2ea5f3?pid=WLMHKDFUYGYP3MYV&lid=LSTWLMHKDFUYGYP3MYVZHNS5J&marketplace=FLIPKART&q=wall+sconce&store=jhg%2F6w8%2Fmbd&srno=s_1_13&otracker=search&otracker1=search&fm=Search&iid=fde05c40-0df6-4116-b6a6-5a0210ee077b.WLMHKDFUYGYP3MYV.SEARCH&ppt=sp&ppn=sp&ssid=pa6ia384sw0000001771732843501&qH=7689bc41b4b11ef7&ov_redirect=true&ov_redirect=true' },
  { id: 'chandelier', name: 'Crystal Chandelier', category: 'Lighting', price: 4200, image: '/assets/chandelier.png', links: 'https://www.flipkart.com/shoppic-villa-crystal-chandelier/p/itm3f3f3f3f3f3f3' },
  { id: 'smart_bulb', name: 'Smart LED Bulb', category: 'Lighting', price: 499, image: '/assets/bulb.png', links: 'https://www.flipkart.com/wipro-9w-smart-led-bulb/p/itm4g4g4g4g4g4g4' },

  // --- BEDROOM ---
  { id: 'bed', name: 'King Size Bed', category: 'Bedroom', price: 12499, image: '/assets/bed.png', links: 'https://www.flipkart.com/flipkart-perfect-homes-opus-engineered-wood-king-box-bed/p/itm7b85ec40e7073' },
  { id: 'nightstand', name: 'Nightstand', category: 'Bedroom', price: 3649, image: '/assets/nightstand.png', links: 'https://www.flipkart.com/true-furniture-sheesham-wood-3-drawer-bed-side-table-night-stand-table-solid/p/itm7a0dbbd76ccb0' },
  { id: 'wardrobe', name: '3-Door Wardrobe', category: 'Bedroom', price: 18999, image: '/assets/wardrobe.png', links: 'https://www.flipkart.com/hometown-new-kelly-engineered-wood-3-door-wardrobe/p/itm5h5h5h5h5h5h5' },
  { id: 'dresser', name: 'Dressing Table', category: 'Bedroom', price: 6500, image: '/assets/dresser.png', links: 'https://www.flipkart.com/spacetown-engineered-wood-dressing-table/p/itm6i6i6i6i6i6i6' },
  { id: 'mattress', name: 'Memory Foam Mattress', category: 'Bedroom', price: 8999, image: '/assets/mattress.png', links: 'https://www.flipkart.com/sleepyhead-original-memory-foam-mattress/p/itm7j7j7j7j7j7j7' },
  { id: 'chest_drawers', name: 'Chest of Drawers', category: 'Bedroom', price: 7200, image: '/assets/chest.png', links: 'https://www.flipkart.com/woodness-engineered-wood-chest-drawers/p/itm8k8k8k8k8k8k8' },

  // --- STORAGE ---
  { id: 'bookshelf', name: 'Bookshelf', category: 'Storage', price: 1753, image: '/assets/bookshelf.png', links: 'https://www.flipkart.com/ew-wooden-large-4-tier-open-bookshelf-rack-showcase-organizer-living-study-room-engineered-wood-book-shelf/p/itm53202f094407e' },
  { id: 'tv_stand', name: 'TV Stand', category: 'Storage', price: 999, image: '/assets/tv_stand.png', links: 'https://www.flipkart.com/home-wood-engineered-tv-entertainment-unit/p/itm6c9f487c4f2cb' },
  { id: 'shoe_rack', name: 'Wooden Shoe Rack', category: 'Storage', price: 1299, image: '/assets/shoerack.png', links: 'https://www.flipkart.com/deckup-beale-engineered-wood-shoe-rack/p/itm9l9l9l9l9l9l9' },
  { id: 'wall_shelf', name: 'Floating Wall Shelves', category: 'Storage', price: 450, image: '/assets/wallshelf.png', links: 'https://www.flipkart.com/art-street-floating-wall-shelf/p/itm10m10m10m10m' },
  { id: 'cabinet', name: 'Storage Cabinet', category: 'Storage', price: 4800, image: '/assets/cabinet.png', links: 'https://www.flipkart.com/bluewud-engineered-wood-cabinet/p/itm11n11n11n11n' },
  { id: 'sideboard', name: 'Kitchen Sideboard', category: 'Storage', price: 9500, image: '/assets/sideboard.png', links: 'https://www.flipkart.com/hometown-engineered-wood-sideboard/p/itm12o12o12o12o' },

  // --- DECOR ---
  { id: 'plant', name: 'Decorative Plant', category: 'Decor', price: 295, image: '/assets/plant.png', links: 'https://www.flipkart.com/reiki-crystal-products-artificial-plants-pot-home-office-decoration-dinning-table-bedroom-etc-bonsai-wild-plant-pot/p/itm93541338a601c' },
  { id: 'wall_art', name: 'Wall Art', category: 'Decor', price: 871, image: '/assets/wall_art.png', links: 'https://www.flipkart.com/zahara-metal-wall-art-set-3-deer-hanging-home-office-living-room-pack/p/itm97d74e99d0833' },
  { id: 'rug', name: 'Area Rug', category: 'Decor', price: 2674, image: '/assets/rug.png', links: 'https://www.flipkart.com/shag-weaving-4-ft-x-6-polyester-carpet/p/itm4b03a86d8b9e0' },
  { id: 'mirror', name: 'Wall Mirror', category: 'Decor', price: 1199, image: '/assets/mirror.png', links: 'https://www.flipkart.com/seven-rays-round-wall-mirror/p/itm13p13p13p13p' },
  { id: 'vase', name: 'Ceramic Vase', category: 'Decor', price: 599, image: '/assets/vase.png', links: 'https://www.flipkart.com/tied-ribbons-ceramic-vase/p/itm14q14q14q14q' },
  { id: 'clock', name: 'Wall Clock', category: 'Decor', price: 750, image: '/assets/clock.png', links: 'https://www.flipkart.com/titan-analog-wall-clock/p/itm15r15r15r15r' },
  { id: 'curtains', name: 'Blackout Curtains', category: 'Decor', price: 899, image: '/assets/curtains.png', links: 'https://www.flipkart.com/fresh-from-loom-curtains/p/itm16s16s16s16s' },

  // --- DINING ---
  { id: 'dining_table', name: 'Dining Table', category: 'Dining', price: 1291, image: '/assets/dining_table.png', links: 'https://www.flipkart.com/euroqon-space-saver-foldable-imported-wood-engineered-4-seater-dining-table/p/itm0ef8ab00ef975' },
  { id: 'dining_chairs', name: 'Set of 4 Chairs', category: 'Dining', price: 5400, image: '/assets/diningchairs.png', links: 'https://www.flipkart.com/finch-fox-solid-wood-dining-chair/p/itm17t17t17t17t' },
  { id: 'crockery_unit', name: 'Crockery Unit', category: 'Dining', price: 11200, image: '/assets/crockery.png', links: 'https://www.flipkart.com/nilkamal-crockery-unit/p/itm18u18u18u18u' },
  { id: 'placemats', name: 'Dining Placemats', category: 'Dining', price: 350, image: '/assets/placemats.png', links: 'https://www.flipkart.com/kuber-industries-placemats/p/itm19v19v19v19v' },
  { id: 'table_runner', name: 'Cotton Table Runner', category: 'Dining', price: 499, image: '/assets/runner.png', links: 'https://www.flipkart.com/house-this-table-runner/p/itm20w20w20w20w' },

  // --- OFFICE ---
  { id: 'desk', name: 'Office Desk', category: 'Office', price: 1398, image: '/assets/desk.png', links: 'https://www.flipkart.com/limraz-furniture-engineered-wood-computer-desk/p/itm9bc4aa1538e18' },
  { id: 'office_chair', name: 'Ergonomic Chair', category: 'Office', price: 4599, image: '/assets/officechair.png', links: 'https://www.flipkart.com/green-soul-beast-ergonomic-chair/p/itm21x21x21x21x' },
  { id: 'filing_cabinet', name: 'Metal Filing Cabinet', category: 'Office', price: 3800, image: '/assets/file_cabinet.png', links: 'https://www.flipkart.com/godrej-interio-filing-cabinet/p/itm22y22y22y22y' },
  { id: 'desk_organizer', name: 'Wooden Desk Organizer', category: 'Office', price: 550, image: '/assets/organizer.png', links: 'https://www.flipkart.com/callas-desk-organizer/p/itm23z23z23z23z' },
  { id: 'whiteboard', name: 'Magnetic Whiteboard', category: 'Office', price: 850, image: '/assets/whiteboard.png', links: 'https://www.flipkart.com/pragati-systems-whiteboard/p/itm24aa24aa24aa' },
  { id: 'trash_can', name: 'Office Trash Can', category: 'Office', price: 299, image: '/assets/trash.png', links: 'https://www.flipkart.com/cello-trash-can/p/itm25bb25bb25bb' }
];


export default function Migration() {
  const uploadData = async () => {
    try {
      const furnitureCollection = collection(db, "furniture");
      for (const item of furnitureLibrary) {
        await addDoc(furnitureCollection, item);
      }
      alert("Success! All items are now in Firestore.");
    } catch (e) {
      console.error(e);
      alert("Upload failed.");
    }
  };

  return (
    <div className="p-20 text-center">
      <h1>Database Migration Tool</h1>
      <button 
        onClick={uploadData}
        className="bg-blue-600 text-white px-6 py-2 rounded mt-4"
      >
        Push Library to Firestore
      </button>
    </div>
  );
}