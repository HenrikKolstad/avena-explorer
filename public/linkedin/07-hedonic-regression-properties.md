# I Used Hedonic Regression to Price 1,881 Properties. Here Is How It Works.

Most people in real estate have never heard of hedonic regression. Most people in quantitative finance use it every day. I used it to build the pricing model behind avenaterminal.com, and I think it is the right approach for anyone trying to value property systematically.

Let me break down what it is, how I applied it, and why it matters.

## The Core Idea

Hedonic regression decomposes the price of a product into the implicit prices of its individual characteristics. The technique was formalized by Sherwin Rosen in 1974, though the intuition is older.

Applied to property: instead of saying "this apartment costs 200,000 EUR," hedonic regression says "this apartment costs 200,000 EUR because it has two bedrooms (worth X), is in Torrevieja (worth Y), has 85 square meters (worth Z), and has a communal pool (worth W)."

By fitting a regression model across hundreds of properties, you can estimate how much each characteristic contributes to the price. Then, for any new property, you can estimate what it should be worth based on its features.

## The Model Specification

For the Avena Terminal scoring engine, the regression model works like this:

**Dependent variable:** Asking price (log-transformed, because property prices are log-normally distributed).

**Independent variables:**
- Town dummy variables (one for each town in the dataset, capturing location-specific pricing)
- Property type dummies (villa, apartment, townhouse, penthouse, bungalow)
- Built area in square meters (continuous)
- Bedroom count
- Bathroom count
- Tier classification (budget, mid, premium -- based on price quintiles within each type)

**Premium multipliers:** On top of the base regression, we apply multiplicative adjustments for:
- Private pool (premium over communal or no pool)
- Prestige zone location (established premium areas within each town)
- Frontline or near-beach position
- Costa del Sol regional premium

The model is estimated using ordinary least squares (OLS). The R-squared is approximately 0.82, meaning the model explains about 82% of the variance in asking prices. That is solid for a property pricing model, though it means 18% of the variance comes from factors we do not observe -- view quality, interior finishes, specific plot position within a development.

## Why Town Dummies Matter

The most important design decision in the model was using town-level dummy variables instead of trying to model location as a continuous variable (like latitude/longitude or distance from some reference point).

Spanish coastal towns have highly specific price levels that do not follow simple geographic gradients. A town with a well-established expat community, good infrastructure, and beach access might price 40% higher than a town ten kilometers away that lacks those features. Geographic distance is a poor proxy for price differences.

Town dummies capture these specific local market conditions directly. The coefficient for each town effectively tells you the price premium or discount that town commands, all else being equal.

In the Avena Terminal model, the town dummies account for roughly 45% of explained price variance. Location dominance is a real estate cliche, but the data confirms it quantitatively.

## Tier Segmentation

Within each property type, there is significant price variation that bedroom count and square meters alone do not explain. A luxury two-bedroom apartment with high-end finishes and a private rooftop terrace prices very differently from a basic two-bedroom apartment of the same size.

We handle this through tier segmentation. Properties are classified into budget, mid, and premium tiers based on their price position within their type category. Each tier gets its own coefficient in the model, capturing the quality premium associated with higher-specification properties.

This tiered approach is similar to how credit risk models segment borrowers: you cannot apply one model across all quality levels without losing accuracy.

## From Regression to Scoring

The regression model produces a price estimate for each property. The scoring engine at avenaterminal.com then compares the actual asking price to this estimate. A property priced 15% below the model estimate scores higher on the Value dimension than one priced at or above the estimate.

But value is only 40% of the total score. The remaining 60% comes from yield estimates (25%), location quality (20%), build quality indicators (10%), and risk factors (5%). A heavily discounted property in a poor location with weak rental demand might have a high value score but a low overall score.

This multi-dimensional approach prevents the model from simply recommending the cheapest properties. Cheap is not the same as good value.

## Limitations and Honest Disclaimers

No model is perfect. Here is where ours falls short:

**View quality.** A sea-view apartment and an apartment facing a parking lot in the same development will price very differently. Our data does not systematically capture view quality.

**Interior specification.** We classify into tiers, but within a tier there is significant variation in finishes, appliances, and design quality.

**Developer reputation.** A property from a well-known developer commands a premium over an identical property from an unknown builder. We partially capture this through pricing patterns but not directly.

**Market timing.** The model reflects current asking prices, not the direction of future prices. It tells you if a property is cheap relative to today's market, not whether today's market is cheap.

These limitations are why the model is a tool, not an oracle. It narrows 1,881 properties to a shortlist of the most interesting opportunities. The final decision still requires human judgment and on-the-ground verification.

You can explore every scored property and see the underlying data at avenaterminal.com. The model is transparent by design.

Full data at avenaterminal.com
