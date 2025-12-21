/**
 * CATEGORY MAPPING LAYER - NON-DESTRUCTIVE
 * 
 * Purpose: Runtime classification and normalization of product categories
 * Safety: Pure functions, no database operations, no side effects
 * Rollback: Simply remove imports - no data cleanup needed
 */

// ==================== CATEGORY HIERARCHY DEFINITION ====================

/**
 * Category hierarchy with parent-child relationships
 * Used for runtime resolution only - does NOT modify stored data
 * 
 * Enhanced with comprehensive keywords for accurate product classification
 */
const CATEGORY_HIERARCHY = {
    'Home & Living': {
        subcategories: ['Furniture', 'Kitchen', 'Storage'],
        keywords: [
            // General home keywords
            'home', 'living', 'decor', 'interior', 'house', 'room', 'household', 'apartment',
            'bedroom', 'bathroom', 'dining', 'hall', 'indoor', 'domestic',
            // Furniture keywords (parent level)
            'furniture', 'chair', 'table', 'sofa', 'couch', 'bed', 'desk', 'cabinet',
            'shelf', 'rack', 'seating', 'mattress', 'wardrobe', 'dresser', 'nightstand',
            // Kitchen keywords (parent level)
            'kitchen', 'cookware', 'utensil', 'appliance', 'cooking', 'baking', 'tableware',
            'dinnerware', 'cutlery', 'kitchenware', 'pan', 'pot', 'plate', 'bowl',
            // Storage keywords (parent level)
            'storage', 'organizer', 'container', 'box', 'basket', 'holder', 'bin',
            // General home items
            'curtain', 'blind', 'cushion', 'pillow', 'blanket', 'rug', 'carpet', 'mat',
            'lamp', 'lighting', 'mirror', 'frame', 'vase', 'plant', 'decoration'
        ],
        tags: ['home', 'living', 'decor', 'interior', 'furniture', 'kitchen', 'storage']
    },
    'Electronics': {
        subcategories: [],
        keywords: [
            'electronic', 'digital', 'tech', 'gadget', 'device', 'smart', 'wireless',
            'mobile', 'phone', 'smartphone', 'tablet', 'ipad',
            'laptop', 'computer', 'pc', 'desktop', 'notebook', 'macbook',
            'headphone', 'earphone', 'earbud', 'speaker', 'audio',
            'charger', 'cable', 'adapter', 'battery', 'power bank',
            'camera', 'webcam', 'monitor', 'screen', 'display',
            'keyboard', 'mouse', 'usb', 'bluetooth',
            'smartwatch', 'fitness tracker', 'wearable',
            'television', 'tv', 'remote', 'hdmi',
            'gaming', 'console', 'playstation', 'xbox',
            'drone', 'robot', 'alexa', 'google home', 'echo'
        ],
        tags: ['electronics', 'tech', 'digital', 'gadget', 'device', 'smart']
    },
    'Fashion': {
        subcategories: [],
        keywords: [
            'fashion', 'clothing', 'apparel', 'wear', 'garment', 'outfit',
            'dress', 'shirt', 'tshirt', 't-shirt', 'top', 'blouse',
            'pant', 'trouser', 'jeans', 'short', 'skirt',
            'jacket', 'coat', 'sweater', 'hoodie', 'cardigan',
            'shoe', 'footwear', 'sneaker', 'boot', 'sandal', 'slipper', 'heel',
            'bag', 'purse', 'backpack', 'handbag', 'wallet', 'clutch',
            'accessory', 'jewelry', 'watch', 'belt', 'tie', 'scarf',
            'hat', 'cap', 'sunglasses', 'glove',
            'underwear', 'lingerie', 'sock', 'innerwear'
        ],
        tags: ['fashion', 'clothing', 'apparel', 'wear', 'style']
    },
    'Beauty & Personal Care': {
        subcategories: [],
        keywords: [
            'beauty', 'cosmetic', 'skincare', 'makeup', 'personal', 'care', 'grooming', 'hygiene',
            'cream', 'lotion', 'moisturizer', 'serum', 'cleanser', 'toner',
            'shampoo', 'conditioner', 'hair oil', 'hair care',
            'perfume', 'fragrance', 'deodorant', 'cologne',
            'lipstick', 'mascara', 'foundation', 'eyeliner', 'kajal',
            'face wash', 'body wash', 'soap', 'sanitizer',
            'razor', 'trimmer', 'shaver', 'epilator',
            'nail polish', 'manicure', 'pedicure',
            'brush', 'comb', 'mirror', 'towel',
            'sunscreen', 'moisturizer', 'face pack', 'mask'
        ],
        tags: ['beauty', 'cosmetic', 'skincare', 'personal care', 'grooming']
    },
    'Sports & Fitness': {
        subcategories: [],
        keywords: [
            'sport', 'fitness', 'exercise', 'workout', 'gym', 'athletic', 'training',
            'yoga', 'pilates', 'meditation', 'stretching',
            'dumbbell', 'weight', 'barbell', 'kettlebell',
            'treadmill', 'cycle', 'bicycle', 'bike',
            'ball', 'football', 'basketball', 'cricket', 'tennis', 'badminton',
            'mat', 'yoga mat', 'exercise mat',
            'resistance band', 'rope', 'jump rope', 'skipping',
            'glove', 'boxing', 'martial arts', 'karate',
            'running', 'jogging', 'walking', 'hiking',
            'swimming', 'water', 'goggles',
            'sportswear', 'activewear', 'athleisure',
            'protein', 'supplement', 'nutrition', 'shake'
        ],
        tags: ['sports', 'fitness', 'exercise', 'gym', 'workout', 'athletic']
    },
    'Books & Stationery': {
        subcategories: [],
        keywords: [
            'book', 'novel', 'textbook', 'journal', 'magazine', 'reading',
            'stationery', 'notebook', 'notepad', 'diary', 'planner',
            'pen', 'pencil', 'marker', 'highlighter', 'eraser',
            'paper', 'writing', 'sketch', 'drawing',
            'file', 'folder', 'binder', 'clip',
            'calculator', 'ruler', 'compass', 'geometry',
            'art', 'craft', 'color', 'crayon', 'paint',
            'stamp', 'ink', 'glue', 'tape', 'scissors',
            'card', 'greeting', 'gift wrap'
        ],
        tags: ['books', 'stationery', 'writing', 'reading', 'office supplies']
    },
    'Grocery': {
        subcategories: [],
        keywords: [
            'grocery', 'food', 'snack', 'beverage', 'drink', 'edible',
            'organic', 'fresh', 'natural', 'healthy',
            'tea', 'coffee', 'juice', 'milk', 'water',
            'biscuit', 'cookie', 'chocolate', 'candy', 'sweet',
            'chips', 'namkeen', 'nuts', 'dry fruit',
            'oil', 'ghee', 'butter', 'spice', 'masala',
            'rice', 'wheat', 'flour', 'grain', 'dal',
            'sauce', 'ketchup', 'pickle', 'jam', 'honey',
            'instant', 'noodles', 'pasta', 'ready to eat'
        ],
        tags: ['grocery', 'food', 'snacks', 'beverage', 'organic']
    },
    'Toys & Baby Products': {
        subcategories: [],
        keywords: [
            'toy', 'baby', 'kid', 'child', 'infant', 'toddler', 'play',
            'doll', 'teddy', 'stuffed', 'plush',
            'puzzle', 'game', 'board game', 'card game',
            'lego', 'block', 'building', 'construction',
            'car', 'truck', 'vehicle', 'train', 'airplane',
            'diaper', 'wipe', 'lotion', 'powder', 'oil',
            'bottle', 'feeder', 'pacifier', 'bib',
            'cradle', 'crib', 'rocker', 'stroller', 'pram',
            'educational', 'learning', 'development',
            'remote control', 'rc', 'battery operated'
        ],
        tags: ['toys', 'baby', 'kids', 'children', 'infant', 'play']
    },
    'Automotive': {
        subcategories: [],
        keywords: [
            'auto', 'automotive', 'car', 'vehicle', 'motorcycle', 'bike', 'motor', 'scooter',
            'tire', 'tyre', 'wheel', 'rim',
            'engine', 'oil', 'filter', 'brake', 'clutch',
            'headlight', 'taillight', 'mirror', 'wiper',
            'seat cover', 'mat', 'dashboard', 'steering',
            'charger', 'mount', 'holder', 'gps',
            'cleaning', 'wash', 'polish', 'wax',
            'tool', 'jack', 'wrench', 'repair',
            'helmet', 'glove', 'riding', 'safety'
        ],
        tags: ['automotive', 'car', 'vehicle', 'bike', 'motor']
    },
    'Health': {
        subcategories: [],
        keywords: [
            'health', 'medical', 'wellness', 'medicine', 'healthcare',
            'vitamin', 'supplement', 'nutrition', 'protein',
            'first aid', 'bandage', 'thermometer', 'blood pressure',
            'mask', 'sanitizer', 'disinfectant', 'hygiene',
            'pain relief', 'tablet', 'capsule', 'syrup',
            'immunity', 'boost', 'energy', 'multivitamin',
            'calcium', 'iron', 'omega', 'probiotic',
            'ayurvedic', 'herbal', 'natural', 'organic',
            'diabetic', 'sugar free', 'low calorie'
        ],
        tags: ['health', 'medical', 'wellness', 'medicine', 'supplement']
    },
    'Office Supplies': {
        subcategories: [],
        keywords: [
            'office', 'desk', 'workspace', 'business', 'corporate', 'supply',
            'chair', 'table', 'cabinet', 'drawer',
            'computer', 'laptop', 'printer', 'scanner',
            'paper', 'file', 'folder', 'organizer',
            'pen', 'pencil', 'marker', 'stapler',
            'whiteboard', 'board', 'eraser', 'duster',
            'calculator', 'shredder', 'laminator',
            'label', 'tag', 'envelope', 'stamp',
            'meeting', 'conference', 'presentation'
        ],
        tags: ['office', 'desk', 'workspace', 'business', 'supplies']
    }
};

// Reverse mapping: subcategory → parent
const SUBCATEGORY_TO_PARENT = {};
Object.keys(CATEGORY_HIERARCHY).forEach(parent => {
    CATEGORY_HIERARCHY[parent].subcategories.forEach(sub => {
        SUBCATEGORY_TO_PARENT[sub] = parent;
    });
});

// All valid top-level categories
const ALL_CATEGORIES = Object.keys(CATEGORY_HIERARCHY);

// ==================== HELPER FUNCTIONS ====================

/**
 * Safely extract tags from product
 * Handles both tagSchema format and simple string arrays
 */
function extractTags(product) {
    if (!product.tags || !Array.isArray(product.tags)) {
        return [];
    }

    return product.tags.map(tag => {
        if (typeof tag === 'string') {
            return tag.toLowerCase();
        }
        if (tag && tag.value) {
            return tag.value.toLowerCase();
        }
        return '';
    }).filter(t => t.trim() !== '');
}

/**
 * Normalize product name for keyword matching
 */
function normalizeText(text) {
    return (text || '').toLowerCase().trim();
}

/**
 * Check if product matches category keywords
 */
function matchesCategoryKeywords(product, categoryName) {
    const categoryDef = CATEGORY_HIERARCHY[categoryName];
    if (!categoryDef) return false;

    const productName = normalizeText(product.name || '');
    const productDescription = normalizeText(product.description || '');
    const productTags = extractTags(product);

    // Check name/description keywords
    const textMatch = categoryDef.keywords.some(keyword =>
        productName.includes(keyword) || productDescription.includes(keyword)
    );

    // Check tag keywords
    const tagMatch = productTags.some(tag =>
        categoryDef.tags.some(catTag => tag.includes(catTag))
    );

    return textMatch || tagMatch;
}

// ==================== CORE MAPPING FUNCTIONS ====================

/**
 * Get parent category for a subcategory
 * Returns null if not a subcategory
 */
function getParentCategory(categoryName) {
    return SUBCATEGORY_TO_PARENT[categoryName] || null;
}

/**
 * Check if a category is a subcategory
 */
function isSubcategory(categoryName) {
    return categoryName in SUBCATEGORY_TO_PARENT;
}

/**
 * Infer additional categories from product tags and name
 * Pure function - no side effects
 * 
 * Enhanced with comprehensive inference rules for accurate multi-category detection
 */
function inferCategoriesFromProduct(product) {
    const inferredCategories = new Set();
    const productTags = extractTags(product);
    const productName = normalizeText(product.name || '');
    const productDescription = normalizeText(product.description || '');
    const productBrand = normalizeText(product.brand || '');

    // ============ PRIORITY RULES (Specific to General) ============

    // Rule 1: Furniture items → Furniture + Home & Living
    const furnitureKeywords = ['furniture', 'chair', 'table', 'sofa', 'couch', 'bed', 'desk',
        'cabinet', 'shelf', 'rack', 'seating', 'mattress', 'wardrobe',
        'dresser', 'nightstand', 'cupboard', 'almirah'];
    if (productTags.some(t => furnitureKeywords.some(kw => t.includes(kw))) ||
        furnitureKeywords.some(kw => productName.includes(kw) || productDescription.includes(kw))) {
        inferredCategories.add('Furniture');
        inferredCategories.add('Home & Living'); // Parent
    }

    // Rule 2: Kitchen items → Kitchen + Home & Living
    const kitchenKeywords = ['kitchen', 'cookware', 'utensil', 'appliance', 'cooking', 'baking',
        'pan', 'pot', 'plate', 'bowl', 'spoon', 'fork', 'knife',
        'mixer', 'grinder', 'blender', 'cooker', 'kettle', 'toaster'];
    if (productTags.some(t => kitchenKeywords.some(kw => t.includes(kw))) ||
        kitchenKeywords.some(kw => productName.includes(kw) || productDescription.includes(kw))) {
        inferredCategories.add('Kitchen');
        inferredCategories.add('Home & Living'); // Parent
    }

    // Rule 3: Storage & Organization → Storage + Home & Living
    const storageKeywords = ['storage', 'organizer', 'container', 'box', 'basket', 'holder',
        'bin', 'drawer', 'rack', 'stand'];
    if (productTags.some(t => storageKeywords.some(kw => t.includes(kw))) ||
        storageKeywords.some(kw => productName.includes(kw))) {
        inferredCategories.add('Storage');
        inferredCategories.add('Home & Living'); // Parent
    }

    // Rule 4: Office Furniture → Office Supplies + Furniture + Home & Living
    const officeFurnitureKeywords = ['office chair', 'office desk', 'office table', 'filing cabinet',
        'conference table', 'workstation', 'cubicle'];
    if (officeFurnitureKeywords.some(kw => productName.includes(kw) || productDescription.includes(kw)) ||
        (productName.includes('office') && furnitureKeywords.some(kw => productName.includes(kw)))) {
        inferredCategories.add('Office Supplies');
        inferredCategories.add('Furniture');
        inferredCategories.add('Home & Living');
    }

    // Rule 5: Home Decor items → Home & Living
    const decorKeywords = ['curtain', 'blind', 'cushion', 'pillow', 'blanket', 'rug', 'carpet',
        'mat', 'lamp', 'lighting', 'mirror', 'frame', 'vase', 'plant',
        'decoration', 'decor', 'wall', 'hanging'];
    if (decorKeywords.some(kw => productName.includes(kw) || productDescription.includes(kw))) {
        inferredCategories.add('Home & Living');
    }

    // Rule 6: Electronics + Accessories multi-category
    const electronicsKeywords = ['mobile', 'phone', 'laptop', 'computer', 'tablet', 'headphone',
        'speaker', 'camera', 'smartwatch'];
    const accessoryKeywords = ['case', 'cover', 'charger', 'cable', 'adapter', 'stand', 'mount',
        'screen protector', 'tempered glass', 'protective'];

    const hasElectronics = electronicsKeywords.some(kw =>
        productName.includes(kw) || productDescription.includes(kw) ||
        productTags.some(t => t.includes(kw))
    );
    const hasAccessory = accessoryKeywords.some(kw =>
        productName.includes(kw) || productDescription.includes(kw) ||
        productTags.some(t => t.includes(kw))
    );

    if (hasElectronics && hasAccessory) {
        inferredCategories.add('Electronics');
        // Accessories are part of Electronics
    } else if (hasElectronics) {
        inferredCategories.add('Electronics');
    }

    // Rule 7: Fashion Accessories → Fashion
    const fashionAccessoryKeywords = ['bag', 'purse', 'backpack', 'wallet', 'belt', 'tie',
        'scarf', 'hat', 'cap', 'sunglasses', 'jewelry', 'watch'];
    if (fashionAccessoryKeywords.some(kw => productName.includes(kw))) {
        inferredCategories.add('Fashion');
    }

    // Rule 8: Sports Equipment in Home → Sports & Fitness + possibly Home & Living
    const sportsHomeKeywords = ['yoga mat', 'exercise mat', 'dumbbell', 'weight', 'treadmill',
        'fitness equipment', 'gym equipment'];
    if (sportsHomeKeywords.some(kw => productName.includes(kw))) {
        inferredCategories.add('Sports & Fitness');
        // Some sports equipment is also home equipment
        if (['mat', 'treadmill', 'bike', 'cycle'].some(kw => productName.includes(kw))) {
            inferredCategories.add('Home & Living');
        }
    }

    // Rule 9: Baby Furniture → Toys & Baby Products + Furniture + Home & Living
    const babyFurnitureKeywords = ['crib', 'cradle', 'baby bed', 'changing table', 'rocker',
        'high chair', 'baby furniture'];
    if (babyFurnitureKeywords.some(kw => productName.includes(kw) || productDescription.includes(kw))) {
        inferredCategories.add('Toys & Baby Products');
        inferredCategories.add('Furniture');
        inferredCategories.add('Home & Living');
    }

    // Rule 10: Books & Stationery overlap with Office Supplies
    const stationeryKeywords = ['pen', 'pencil', 'notebook', 'file', 'folder', 'marker',
        'stapler', 'paper', 'clip'];
    if (stationeryKeywords.some(kw => productName.includes(kw))) {
        inferredCategories.add('Books & Stationery');
        // Office supplies also include stationery
        if (['file', 'folder', 'stapler', 'organizer'].some(kw => productName.includes(kw))) {
            inferredCategories.add('Office Supplies');
        }
    }

    // Rule 11: Health & Beauty overlap
    const healthBeautyKeywords = ['sanitizer', 'mask', 'soap', 'lotion', 'oil'];
    if (healthBeautyKeywords.some(kw => productName.includes(kw))) {
        // Check context to determine primary category
        if (productName.includes('hair') || productName.includes('face') ||
            productName.includes('body') || productTags.some(t => ['beauty', 'cosmetic'].includes(t))) {
            inferredCategories.add('Beauty & Personal Care');
        }
        if (productName.includes('medical') || productName.includes('antiseptic') ||
            productTags.some(t => ['health', 'medical'].includes(t))) {
            inferredCategories.add('Health');
        }
        // If unclear, add both
        if (inferredCategories.size === 0) {
            inferredCategories.add('Beauty & Personal Care');
        }
    }

    // Rule 12: Automotive Accessories
    const automotiveKeywords = ['car', 'vehicle', 'bike', 'motorcycle', 'auto'];
    if (automotiveKeywords.some(kw => productName.includes(kw) || productDescription.includes(kw))) {
        inferredCategories.add('Automotive');
    }

    // ============ GENERAL KEYWORD MATCHING (All Categories) ============

    // Rule 13: General category keyword matching for all categories
    ALL_CATEGORIES.forEach(categoryName => {
        // Skip if already added by specific rules
        if (!inferredCategories.has(categoryName) &&
            !inferredCategories.has(getParentCategory(categoryName) || '')) {
            if (matchesCategoryKeywords(product, categoryName)) {
                inferredCategories.add(categoryName);
            }
        }
    });

    // ============ BRAND-BASED INFERENCE ============

    // Rule 14: Brand-based categorization
    const brandCategoryMap = {
        'apple': 'Electronics',
        'samsung': 'Electronics',
        'dell': 'Electronics',
        'hp': 'Electronics',
        'lenovo': 'Electronics',
        'sony': 'Electronics',
        'lg': 'Electronics',
        'nike': 'Sports & Fitness',
        'adidas': 'Sports & Fitness',
        'puma': 'Sports & Fitness'
    };

    if (productBrand && brandCategoryMap[productBrand]) {
        inferredCategories.add(brandCategoryMap[productBrand]);
    }

    // ============ ENSURE PARENT CATEGORIES ============

    // Rule 15: Always add parent category if subcategory is present
    const categoriesToCheck = Array.from(inferredCategories);
    categoriesToCheck.forEach(cat => {
        const parent = getParentCategory(cat);
        if (parent) {
            inferredCategories.add(parent);
        }
    });

    return Array.from(inferredCategories);
}

/**
 * Resolve all categories for a product (main function)
 * 
 * @param {Object} product - Product object (can be Mongoose document or plain object)
 * @returns {Object} - { primary: string, all: string[], hierarchy: Object }
 */
function resolveProductCategories(product) {
    // Convert Mongoose document to plain object if needed
    const productObj = product.toObject ? product.toObject() : product;

    // Start with existing category/categories
    const existingCategory = productObj.category || 'Electronics';
    const existingCategories = productObj.categories || [existingCategory];

    // Use Set to avoid duplicates
    const allCategoriesSet = new Set(existingCategories);

    // Add stored category to set
    if (existingCategory) {
        allCategoriesSet.add(existingCategory);
    }

    // Infer additional categories
    const inferredCategories = inferCategoriesFromProduct(productObj);
    inferredCategories.forEach(cat => allCategoriesSet.add(cat));

    // Handle subcategory → parent relationship
    const allCategoriesArray = Array.from(allCategoriesSet);
    allCategoriesArray.forEach(cat => {
        const parent = getParentCategory(cat);
        if (parent) {
            allCategoriesSet.add(parent);
        }
    });

    const finalCategories = Array.from(allCategoriesSet);

    // Determine primary category
    // Priority: existing category > first inferred > default
    let primaryCategory = existingCategory;
    if (!ALL_CATEGORIES.includes(primaryCategory) && finalCategories.length > 0) {
        primaryCategory = finalCategories[0];
    }

    // Build hierarchy info
    const hierarchy = {};
    if (isSubcategory(existingCategory)) {
        hierarchy.subcategory = existingCategory;
        hierarchy.parent = getParentCategory(existingCategory);
    }

    return {
        primary: primaryCategory || 'Electronics',
        all: finalCategories.length > 0 ? finalCategories : ['Electronics'],
        hierarchy: Object.keys(hierarchy).length > 0 ? hierarchy : null
    };
}

/**
 * Calculate accurate product counts per category
 * Handles multi-category products without double counting within same category
 * 
 * @param {Array} products - Array of products (with or without resolved categories)
 * @param {Array} categories - Array of category objects from DB (optional)
 * @returns {Object} - { 'Electronics': 45, 'Home & Living': 28, ... }
 */
function calculateCategoryProductCounts(products, categories = []) {
    const counts = {};

    // Initialize all known categories to 0
    ALL_CATEGORIES.forEach(cat => {
        counts[cat] = 0;
    });

    // Also initialize managed categories from DB
    if (categories && Array.isArray(categories)) {
        categories.forEach(cat => {
            const catName = cat.name || cat;
            if (!counts[catName]) {
                counts[catName] = 0;
            }
        });
    }

    // Count products (each product counted once per category it belongs to)
    products.forEach(product => {
        const resolved = product.resolvedCategories || resolveProductCategories(product);
        const productCategories = resolved.all || [resolved.primary || 'Electronics'];

        // Track which categories this product has been counted in
        const countedInCategories = new Set();

        productCategories.forEach(categoryName => {
            // Only count once per category (avoid duplicates)
            if (!countedInCategories.has(categoryName)) {
                counts[categoryName] = (counts[categoryName] || 0) + 1;
                countedInCategories.add(categoryName);
            }
        });
    });

    return counts;
}

/**
 * Normalize category name for consistent display
 * Returns parent category if subcategory, else returns as-is
 */
function normalizeCategoryHierarchy(categoryName) {
    const parent = getParentCategory(categoryName);
    return parent || categoryName;
}

// ==================== EXPORTS ====================

module.exports = {
    // Main functions
    resolveProductCategories,
    calculateCategoryProductCounts,

    // Helper functions
    getParentCategory,
    isSubcategory,
    normalizeCategoryHierarchy,
    inferCategoriesFromProduct,

    // Constants (for testing/debugging)
    CATEGORY_HIERARCHY,
    ALL_CATEGORIES,
    SUBCATEGORY_TO_PARENT
};
