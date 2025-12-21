/**
 * Recommendation System Utilities
 * Implements deterministic scoring for user personalized tags.
 */

const ACTION_WEIGHTS = {
    CLICK: 1,
    WISHLIST: 2,
    CART: 3,
    PURCHASE: 5
};

const MAX_TAGS = 25;
const DECAY_FACTOR = 0.9;

/**
 * Updates a user's personalized tags based on an interaction with a product.
 * 
 * @param {Object} user - The mongoose user document
 * @param {Object} product - The product document being interacted with
 * @param {String} actionType - One of 'CLICK', 'WISHLIST', 'CART', 'PURCHASE'
 */
const updatePersonalizedTags = async (user, product, actionType) => {
    if (!user || !product || !ACTION_WEIGHTS[actionType]) return;

    const actionWeight = ACTION_WEIGHTS[actionType];

    // Initialize personalizedTags if it doesn't exist (though schema has default)
    if (!user.personalizedTags) {
        user.personalizedTags = new Map();
    }

    // Process product tags
    if (product.tags && Array.isArray(product.tags)) {
        product.tags.forEach(tag => {
            // Recommendation Rules:
            // attribute: YES, category: LOW WEIGHT (0.2), brand: IGNORE
            let tagMultiplier = 0;
            if (tag.type === 'attribute') tagMultiplier = 1;
            else if (tag.type === 'category') tagMultiplier = 0.2;
            else if (tag.type === 'usage') tagMultiplier = 0.5; // Custom addition for usage type

            if (tagMultiplier > 0) {
                const tagValue = tag.value.toLowerCase().trim();
                const currentScore = user.personalizedTags.get(tagValue) || 0;
                const increment = actionWeight * (tag.weight || 1) * tagMultiplier;
                user.personalizedTags.set(tagValue, currentScore + increment);
            }
        });
    }

    // Limit to top 25 tags
    if (user.personalizedTags.size > MAX_TAGS) {
        const sortedTags = Array.from(user.personalizedTags.entries())
            .sort((a, b) => b[1] - a[1]); // Sort by score DESC

        const topTags = sortedTags.slice(0, MAX_TAGS);
        user.personalizedTags = new Map(topTags);
    }

    user.markModified('personalizedTags');
    await user.save();
};

/**
 * Periodically decays user scores to keep recommendations fresh.
 * Should be called on login or via a cron job.
 * 
 * @param {Object} user - The mongoose user document
 */
const decayUserScores = async (user) => {
    if (!user || !user.personalizedTags || user.personalizedTags.size === 0) return;

    // Only decay once per week (approximate check using lastLogin or a custom field)
    // For simplicity, we'll implement the logic and leave the "when" to the caller.
    for (let [tag, score] of user.personalizedTags) {
        user.personalizedTags.set(tag, score * DECAY_FACTOR);
    }

    user.markModified('personalizedTags');
    await user.save();
};

module.exports = {
    updatePersonalizedTags,
    decayUserScores,
    ACTION_WEIGHTS
};
