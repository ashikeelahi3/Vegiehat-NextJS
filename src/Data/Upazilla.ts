export type DistrictType = {
  id: number;
  name: string;
  division: string;
  upazilla: string[];
};

export const Districts: DistrictType[] = [
  // Chattogram Division
  {
    id: 1,
    name: 'Cumilla',
    division: 'Chattogram',
    upazilla: ["Debidwar", "Barura", "Brahmanpara", "Chandina", "Chauddagram", "Daudkandi", "Homna", "Laksam", "Muradnagar", "Nangalkot", "Cumillasadar", "Meghna", "Monohargonj", "Sadarsouth", "Titas", "Burichang", "Lalmai"]
  },
  {
    id: 2,
    name: 'Feni',
    division: 'Chattogram',
    upazilla: ["Chhagalnaiya", "Sadar", "Sonagazi", "Fulgazi", "Parshuram", "Daganbhuiyan"]
  },
  {
    id: 3,
    name: 'Brahmanbaria',
    division: 'Chattogram',
    upazilla: ["Sadar", "Kasba", "Nasirnagar", "Sarail", "Ashuganj", "Akhaura", "Nabinagar", "Bancharampur", "Bijoynagar"]
  },
  {
    id: 4,
    name: 'Rangamati',
    division: 'Chattogram',
    upazilla: ["Sadar", "Kaptai", "Kawkhali", "Baghaichari", "Barkal", "Langadu", "Rajasthali", "Belaichari", "Juraichari", "Naniarchar"]
  },
  {
    id: 5,
    name: 'Noakhali',
    division: 'Chattogram',
    upazilla: ["Sadar", "Companiganj", "Begumganj", "Hatia", "Subarnachar", "Kabirhat", "Senbug", "Chatkhil", "Sonaimuri"]
  },
  {
    id: 6,
    name: 'Chandpur',
    division: 'Chattogram',
    upazilla: ["Haimchar", "Kachua", "Shahrasti", "Sadar", "Matlabsouth", "Hajiganj", "Matlabnorth", "Faridgonj"]
  },
  {
    id: 7,
    name: 'Lakshmipur',
    division: 'Chattogram',
    upazilla: ["Sadar", "Kamalnagar", "Raipur", "Ramgati", "Ramganj"]
  },
  {
    id: 8,
    name: 'Chattogram',
    division: 'Chattogram',
    upazilla: ["Rangunia", "Sitakunda", "Mirsharai", "Patiya", "Sandwip", "Banshkhali", "Boalkhali", "Anwara", "Chandanaish", "Satkania", "Lohagara", "Hathazari", "Fatikchhari", "Raozan", "Karnafuli"]
  },
  {
    id: 9,
    name: 'Coxsbazar',
    division: 'Chattogram',
    upazilla: ["Sadar", "Chakaria", "Kutubdia", "Ukhiya", "Moheshkhali", "Pekua", "Ramu", "Teknaf"]
  },
  {
    id: 10,
    name: 'Khagrachhari',
    division: 'Chattogram',
    upazilla: ["Sadar", "Dighinala", "Panchari", "Laxmichhari", "Mohalchari", "Manikchari", "Ramgarh", "Matiranga", "Guimara"]
  },
  {
    id: 11,
    name: 'Bandarban',
    division: 'Chattogram',
    upazilla: ["Sadar", "Alikadam", "Naikhongchhari", "Rowangchhari", "Lama", "Ruma", "Thanchi"]
  },

  // Rajshahi Division
  {
    id: 12,
    name: 'Sirajganj',
    division: 'Rajshahi',
    upazilla: ["Belkuchi", "Chauhali", "Kamarkhand", "Kazipur", "Raigonj", "Shahjadpur", "Sirajganjsadar", "Tarash", "Ullapara"]
  },
  {
    id: 13,
    name: 'Pabna',
    division: 'Rajshahi',
    upazilla: ["Sujanagar", "Ishurdi", "Bhangura", "Pabnasadar", "Bera", "Atghoria", "Chatmohar", "Santhia", "Faridpur"]
  },
  {
    id: 14,
    name: 'Bogura',
    division: 'Rajshahi',
    upazilla: ["Kahaloo", "Sadar", "Shariakandi", "Shajahanpur", "Dupchanchia", "Adamdighi", "Nondigram", "Sonatala", "Dhunot", "Gabtali", "Sherpur", "Shibganj"]
  },
  {
    id: 15,
    name: 'Rajshahi',
    division: 'Rajshahi',
    upazilla: ["Paba", "Durgapur", "Mohonpur", "Charghat", "Puthia", "Bagha", "Godagari", "Tanore", "Bagmara"]
  },
  {
    id: 16,
    name: 'Natore',
    division: 'Rajshahi',
    upazilla: ["Natoresadar", "Singra", "Baraigram", "Bagatipara", "Lalpur", "Gurudaspur", "Naldanga"]
  },
  {
    id: 17,
    name: 'Joypurhat',
    division: 'Rajshahi',
    upazilla: ["Akkelpur", "Kalai", "Khetlal", "Panchbibi", "Joypurhatsadar"]
  },
  {
    id: 18,
    name: 'Chapainawabganj',
    division: 'Rajshahi',
    upazilla: ["Chapainawabganjsadar", "Gomostapur", "Nachol", "Bholahat", "Shibganj"]
  },
  {
    id: 19,
    name: 'Naogaon',
    division: 'Rajshahi',
    upazilla: ["Mohadevpur", "Badalgachi", "Patnitala", "Dhamoirhat", "Niamatpur", "Manda", "Atrai", "Raninagar", "Naogaonsadar", "Porsha", "Sapahar"]
  },

  // Khulna Division
  {
    id: 20,
    name: 'Khulna',
    division: 'Khulna',
    upazilla: ["Paikgachha", "Dacope", "Batiaghata", "Dumuria", "Dighalia", "Koyra", "Terokhada", "Rupsa", "Phultala"]
  },
  {
    id: 21,
    name: 'Bagerhat',
    division: 'Khulna',
    upazilla: ["Fakirhat", "Bagerhat Sadar", "Mollahat", "Sarankhola", "Rampal", "Morrelganj", "Kachua", "Mongla", "Chitalmari"]
  },
  {
    id: 22,
    name: 'Satkhira',
    division: 'Khulna',
    upazilla: ["Satkhira Sadar", "Assasuni", "Debhata", "Tala", "Kalaroa", "Kaliganj", "Shyamnagar"]
  },
  {
    id: 23,
    name: 'Jashore',
    division: 'Khulna',
    upazilla: ["Manirampur", "Abhaynagar", "Bagherpara", "Chougachha", "Jhikargacha", "Keshabpur", "Jashore Sadar", "Sharsha"]
  },
  {
    id: 24,
    name: 'Jhenaidah',
    division: 'Khulna',
    upazilla: ["Jhenaidah Sadar", "Maheshpur", "Kaliganj", "Kotchandpur", "Shailkupa", "Harinakunda"]
  },
  {
    id: 25,
    name: 'Magura',
    division: 'Khulna',
    upazilla: ["Magura Sadar", "Mohammadpur", "Shalikha", "Sreepur"]
  },
  {
    id: 26,
    name: 'Narail',
    division: 'Khulna',
    upazilla: ["Narail Sadar", "Lohagara", "Kalia"]
  },
  {
    id: 27,
    name: 'Chuadanga',
    division: 'Khulna',
    upazilla: ["Chuadanga Sadar", "Alamdanga", "Damurhuda", "Jibannagar"]
  },
  {
    id: 28,
    name: 'Kushtia',
    division: 'Khulna',
    upazilla: ["Kushtia Sadar", "Kumarkhali", "Khoksa", "Mirpur", "Daulatpur", "Bheramara"]
  },
  {
    id: 29,
    name: 'Meherpur',
    division: 'Khulna',
    upazilla: ["Meherpur Sadar", "Mujibnagar", "Gangni"]
  },

  // Barishal Division
  {
    id: 30,
    name: 'Barishal',
    division: 'Barishal',
    upazilla: ["Barishal Sadar", "Bakerganj", "Babuganj", "Wazirpur", "Banaripara", "Gournadi", "Agailjhara", "Mehendiganj", "Muladi", "Hizla"]
  },
  {
    id: 31,
    name: 'Barguna',
    division: 'Barishal',
    upazilla: ["Barguna Sadar", "Amtali", "Betagi", "Bamna", "Pathorghata", "Taltali"]
  },
  {
    id: 32,
    name: 'Bhola',
    division: 'Barishal',
    upazilla: ["Bhola Sadar", "Borhanuddin", "Charfesson", "Doulatkhan", "Lalmohan", "Manpura", "Tazumuddin"]
  },
  {
    id: 33,
    name: 'Jhalokati',
    division: 'Barishal',
    upazilla: ["Jhalokati Sadar", "Kathalia", "Nalchity", "Rajapur"]
  },
  {
    id: 34,
    name: 'Patuakhali',
    division: 'Barishal',
    upazilla: ["Patuakhali Sadar", "Bauphal", "Dashmina", "Dumki", "Kalapara", "Mirzaganj", "Galachipa", "Rangabali"]
  },
  {
    id: 35,
    name: 'Pirojpur',
    division: 'Barishal',
    upazilla: ["Pirojpur Sadar", "Nazirpur", "Kawkhali", "Zianagar", "Bhandaria", "Mathbaria", "Nesarabad"]
  },

  // Sylhet Division
  {
    id: 36,
    name: 'Sylhet',
    division: 'Sylhet',
    upazilla: ["Balaganj", "Beanibazar", "Bishwanath", "Companiganj", "Fenchuganj", "Golapganj", "Gowainghat", "Jaintiapur", "Kanaighat", "Sylhetsadar", "Zakiganj", "Dakshinsurma", "Osmaninagar"]
  },
  {
    id: 37,
    name: 'Moulvibazar',
    division: 'Sylhet',
    upazilla: ["Moulvibazar Sadar", "Kamalganj", "Kulaura", "Rajnagar", "Sreemangal", "Barlekha", "Juri"]
  },
  {
    id: 38,
    name: 'Habiganj',
    division: 'Sylhet',
    upazilla: ["Nabiganj", "Bahubal", "Ajmiriganj", "Baniachong", "Lakhai", "Chunarughat", "Habiganj Sadar", "Madhabpur", "Shayestaganj"]
  },
  {
    id: 39,
    name: 'Sunamganj',
    division: 'Sylhet',
    upazilla: ["Sunamganj Sadar", "South Sunamganj", "Bishwambarpur", "Chhatak", "Jagannathpur", "Dowarabazar", "Tahirpur", "Dharmapasha", "Jamalganj", "Shalla", "Derai"]
  },

  // Dhaka Division
  {
    id: 40,
    name: 'Dhaka',
    division: 'Dhaka',
    upazilla: ["Savar", "Dhamrai", "Keraniganj", "Nawabganj", "Dohar"]
  },
  {
    id: 41,
    name: 'Gazipur',
    division: 'Dhaka',
    upazilla: ["Gazipur Sadar", "Kaliakair", "Kapasia", "Sreepur", "Kaliganj"]
  },
  {
    id: 42,
    name: 'Narsingdi',
    division: 'Dhaka',
    upazilla: ["Belabo", "Monohardi", "Narsingdi Sadar", "Palash", "Raipura", "Shibpur"]
  },
  {
    id: 43,
    name: 'Manikganj',
    division: 'Dhaka',
    upazilla: ["Manikganj Sadar", "Singair", "Saturiaa", "Harirampur", "Ghior", "Shibalaya", "Daulatpur"]
  },
  {
    id: 44,
    name: 'Munshiganj',
    division: 'Dhaka',
    upazilla: ["Munshiganj Sadar", "Sreenagar", "Sirajdikhan", "Louhajanj", "Gajaria", "Tongibari"]
  },
  {
    id: 45,
    name: 'Narayanganj',
    division: 'Dhaka',
    upazilla: ["Araihazar", "Bandar", "Narayanganj Sadar", "Rupganj", "Sonargaon"]
  },
  {
    id: 46,
    name: 'Tangail',
    division: 'Dhaka',
    upazilla: ["Basail", "Bhuapur", "Delduar", "Ghatail", "Gopalpur", "Madhupur", "Mirzapur", "Nagarpur", "Sakhipur", "Tangail Sadar", "Kalihati", "Dhanbari"]
  },
  {
    id: 47,
    name: 'Kishoreganj',
    division: 'Dhaka',
    upazilla: ["Itna", "Katiadi", "Bhairab", "Tarail", "Hossainpur", "Pakundia", "Kuliarchar", "Kishoreganj Sadar", "Karimganj", "Bajitpur", "Austagram", "Mithamain", "Nikli"]
  },
  {
    id: 48,
    name: 'Madaripur',
    division: 'Dhaka',
    upazilla: ["Madaripur Sadar", "Shibchar", "Kalkini", "Rajoir", "Dasar"]
  },
  {
    id: 49,
    name: 'Rajbari',
    division: 'Dhaka',
    upazilla: ["Rajbari Sadar", "Goalanda", "Pangsha", "Baliakandi", "Kalukhali"]
  },
  {
    id: 50,
    name: 'Gopalganj',
    division: 'Dhaka',
    upazilla: ["Gopalganj Sadar", "Kashiani", "Tungipara", "Kotalipara", "Muksudpur"]
  },
  {
    id: 51,
    name: 'Faridpur',
    division: 'Dhaka',
    upazilla: ["Faridpur Sadar", "Alfadanga", "Boalmari", "Sadarpur", "Nagarkanda", "Bhanga", "Charbhadrasan", "Madhukhali", "Saltha"]
  },
  {
    id: 52,
    name: 'Shariatpur',
    division: 'Dhaka',
    upazilla: ["Shariatpur Sadar", "Naria", "Zajira", "Gosairhat", "Bhedarganj", "Damudya"]
  },

  // Rangpur Division
  {
    id: 53,
    name: 'Rangpur',
    division: 'Rangpur',
    upazilla: ["Rangpur Sadar", "Gangachara", "Taragonj", "Badargonj", "Mithapukur", "Pirgonj", "Kaunia", "Pirgacha"]
  },
  {
    id: 54,
    name: 'Panchagarh',
    division: 'Rangpur',
    upazilla: ["Panchagarh Sadar", "Debiganj", "Boda", "Atwari", "Tetulia"]
  },
  {
    id: 55,
    name: 'Dinajpur',
    division: 'Rangpur',
    upazilla: ["Nawabganj", "Birganj", "Ghoraghat", "Birampur", "Parbatipur", "Bochaganj", "Kaharol", "Fulbari", "Dinajpur Sadar", "Hakimpur", "Khansama", "Birol", "Chirirbandar"]
  },
  {
    id: 56,
    name: 'Lalmonirhat',
    division: 'Rangpur',
    upazilla: ["Lalmonirhat Sadar", "Kaliganj", "Hatibandha", "Patgram", "Aditmari"]
  },
  {
    id: 57,
    name: 'Nilphamari',
    division: 'Rangpur',
    upazilla: ["Nilphamari Sadar", "Saidpur", "Jaldhaka", "Kishoreganj", "Domar", "Dimla"]
  },
  {
    id: 58,
    name: 'Gaibandha',
    division: 'Rangpur',
    upazilla: ["Gaibandha Sadar", "Sadullapur", "Palashbari", "Saghata", "Gobindaganj", "Sundarganj", "Phulchari"]
  },
  {
    id: 59,
    name: 'Thakurgaon',
    division: 'Rangpur',
    upazilla: ["Thakurgaon Sadar", "Pirganj", "Ranisankail", "Haripur", "Baliadangi"]
  },
  {
    id: 60,
    name: 'Kurigram',
    division: 'Rangpur',
    upazilla: ["Kurigram Sadar", "Nageshwari", "Bhurungamari", "Phulbari", "Rajarhat", "Ulipur", "Chilmari", "Rowmari", "Char Rajibpur"]
  },

  // Mymensingh Division
  {
    id: 61,
    name: 'Mymensingh',
    division: 'Mymensingh',
    upazilla: ["Mymensingh Sadar", "Muktagachha", "Gauripur", "Phulpur", "Haluaghat", "Trishal", "Ishwarganj", "Nandail", "Gafargaon", "Tara Khanda", "Bhaluka", "Dhobaura", "Fulbaria"]
  },
  {
    id: 62,
    name: 'Jamalpur',
    division: 'Mymensingh',
    upazilla: ["Jamalpur Sadar", "Melandaha", "Islampur", "Dewanganj", "Sarishabari", "Madarganj", "Bokshiganj"]
  },
  {
    id: 63,
    name: 'Netrokona',
    division: 'Mymensingh',
    upazilla: ["Netrokona Sadar", "Kendua", "Atpara", "Madan", "Khaliajuri", "Kalmakanda", "Mohongonj", "Purbadhala", "Durgapur", "Barhatta"]
  },
  {
    id: 64,
    name: 'Sherpur',
    division: 'Mymensingh',
    upazilla: ["Sherpur Sadar", "Nalitabari", "Sreebordi", "Nokla", "Jhenaigati"]
  }
];

export const Divisions = [
  "Chattogram",
  "Rajshahi",
  "Khulna",
  "Barishal",
  "Sylhet",
  "Dhaka",
  "Rangpur",
  "Mymensingh"
];
