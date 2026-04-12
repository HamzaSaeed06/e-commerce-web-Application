export const synonymMap: Record<string, string[]> = {
  'mobile': ['phone', 'smartphone', 'cell', 'cellphone', 'handset'],
  'phone': ['mobile', 'smartphone', 'cell', 'cellphone', 'handset'],
  'smartphone': ['mobile', 'phone', 'cell', 'cellphone'],
  'laptop': ['notebook', 'computer', 'pc', 'portable computer', 'macbook'],
  'notebook': ['laptop', 'computer', 'pc'],
  'computer': ['laptop', 'desktop', 'pc', 'notebook', 'workstation'],
  'shoes': ['sneakers', 'footwear', 'kicks', 'boots', 'sandals', 'loafers'],
  'sneakers': ['shoes', 'footwear', 'kicks', 'trainers', 'running shoes'],
  'footwear': ['shoes', 'sneakers', 'boots', 'sandals', 'loafers'],
  'shirt': ['top', 'tee', 't-shirt', 'blouse', 'polo', 'button-up'],
  't-shirt': ['shirt', 'tee', 'top'],
  'tee': ['t-shirt', 'shirt', 'top'],
  'watch': ['timepiece', 'wristwatch', 'smartwatch', 'chronometer'],
  'timepiece': ['watch', 'wristwatch', 'clock'],
  'headphones': ['earphones', 'earbuds', 'headset', 'audio'],
  'earphones': ['headphones', 'earbuds', 'headset'],
  'earbuds': ['earphones', 'headphones', 'airpods'],
  'camera': ['dslr', 'mirrorless', 'photography', 'camcorder'],
  'bag': ['handbag', 'purse', 'backpack', 'tote', 'satchel'],
  'handbag': ['bag', 'purse', 'tote'],
  'glasses': ['eyewear', 'sunglasses', 'spectacles', 'shades'],
  'sunglasses': ['glasses', 'eyewear', 'shades'],
  'jewelry': ['jewellery', 'accessories', 'ornaments', 'gems'],
  'ring': ['band', 'jewelry', 'jewellery'],
  'necklace': ['pendant', 'chain', 'jewelry'],
  'bracelet': ['bangle', 'wristband', 'jewelry'],
  'furniture': ['furnishings', 'home decor', 'interior'],
  'chair': ['seat', 'furniture', 'stool'],
  'table': ['desk', 'furniture', 'dining table'],
  'sofa': ['couch', 'furniture', 'settee'],
  'bed': ['mattress', 'furniture', 'bunk'],
  'kitchen': ['culinary', 'cooking', 'cookware'],
  'appliances': ['gadgets', 'electronics', 'devices'],
  'fridge': ['refrigerator', 'cooler', 'appliance'],
  'tv': ['television', 'screen', 'monitor', 'display'],
  'television': ['tv', 'screen', 'monitor'],
  'beauty': ['cosmetics', 'makeup', 'skincare'],
  'makeup': ['cosmetics', 'beauty'],
  'skincare': ['beauty', 'cosmetics', 'face care'],
  'perfume': ['fragrance', 'scent', 'cologne'],
  'sports': ['fitness', 'athletic', 'workout', 'gym'],
  'fitness': ['sports', 'workout', 'exercise', 'gym'],
  'toys': ['games', 'playthings', 'kids'],
  'games': ['toys', 'video games', 'board games'],
  'book': ['novel', 'publication', 'literature'],
  'music': ['audio', 'songs', 'albums', 'tracks'],
  'gift': ['present', 'surprise', 'token'],
  'sale': ['discount', 'deal', 'offer', 'promotion', 'clearance'],
  'discount': ['sale', 'deal', 'offer', 'promotion'],
  'new': ['latest', 'recent', 'brand new', 'fresh'],
  'best': ['top', 'premium', 'excellent', 'highest rated'],
  'cheap': ['affordable', 'budget', 'low price', 'inexpensive'],
  'expensive': ['premium', 'luxury', 'high-end', 'pricey'],
  'wireless': ['bluetooth', 'cordless', 'wifi'],
  'waterproof': ['water-resistant', 'weatherproof', 'sealed'],
};

export const expandQuery = (query: string): string[] => {
  const terms = [query.toLowerCase().trim()];
  const words = query.toLowerCase().trim().split(/\s+/);
  
  // Add original query variations
  terms.push(query.toLowerCase().trim());
  
  // Expand each word with synonyms
  words.forEach(word => {
    const synonyms = synonymMap[word];
    if (synonyms) {
      synonyms.forEach(synonym => {
        // Replace the word with synonym in the query
        const expanded = words.map(w => w === word ? synonym : w).join(' ');
        terms.push(expanded);
      });
    }
  });
  
  // Add combinations
  Object.entries(synonymMap).forEach(([key, synonyms]) => {
    if (query.toLowerCase().includes(key)) {
      synonyms.forEach(syn => {
        const expanded = query.toLowerCase().replace(key, syn);
        terms.push(expanded);
      });
    }
    synonyms.forEach(syn => {
      if (query.toLowerCase().includes(syn)) {
        const expanded = query.toLowerCase().replace(syn, key);
        terms.push(expanded);
      }
    });
  });
  
  return [...new Set(terms)];
};

export const getRelatedTerms = (query: string): string[] => {
  const related: string[] = [];
  const words = query.toLowerCase().trim().split(/\s+/);
  
  words.forEach(word => {
    const synonyms = synonymMap[word];
    if (synonyms) {
      related.push(...synonyms);
    }
  });
  
  return [...new Set(related)].slice(0, 10);
};
