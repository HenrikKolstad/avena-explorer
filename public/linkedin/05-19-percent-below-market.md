# 19% Below Market: How I Find Underpriced Properties in Spain

When I tell people that some new build properties in Spain are listed 19% below what our model estimates as fair value, the first question is always: why would a developer underprice?

It is a fair question. Here is the answer, and it is more nuanced than you might expect.

## Why Underpricing Happens

Developers are not irrational, but they operate under constraints that buyers rarely see.

**Cash flow pressure.** A development of 80 units needs to sell a certain percentage before the bank releases the next tranche of construction financing. If sales stall at 60%, the developer faces a choice: hold prices and risk a cash crunch, or reduce prices on remaining units to unlock the next funding phase. They usually reduce.

**Phase pricing.** Many developers deliberately price Phase 1 below market to generate initial sales momentum and social proof. Early buyers get genuine discounts. By Phase 3, prices are 15-25% higher. If you can identify Phase 1 releases, you are buying at an inherent discount.

**Portfolio balancing.** Large developers with multiple active projects sometimes discount underperforming locations to rebalance their sales pipeline. A development in a less fashionable town might get aggressive pricing to compete with the developer's own premium project down the coast.

**Information gaps.** Some developers -- especially smaller local ones -- simply do not have great market data. They price based on construction cost plus a margin, without modeling what the market will bear. Occasionally that produces listings significantly below what comparable properties sell for.

## How the Model Finds Them

The scoring engine at avenaterminal.com uses hedonic regression to estimate what each property should be worth based on its characteristics. The model considers:

- Town-level pricing (using dummy variables for each town)
- Property type (villa, apartment, townhouse, penthouse, bungalow)
- Size in square meters
- Bedroom and bathroom count
- Tier classification (budget, mid, premium)
- Location premiums (pool type, prestige zones, frontline, Costa del Sol adjustment)

When a listing comes in at a price significantly below the model's estimate, it gets flagged with a high discount percentage. That discount feeds into the Value dimension of the overall score, which carries a 40% weight in the composite.

## What 19% Below Looks Like

Let me give you a concrete example pattern, without identifying the specific listing.

A two-bedroom apartment in a mid-tier Costa Blanca South town. Our model estimates fair value at approximately 220,000 EUR based on the town average, the size, the specifications, and the location. The listing price is 178,000 EUR. That is a 19% discount.

The property also happens to sit 1.8 km from the coast, has a communal pool, and the development is from a known developer. Gross yield estimate comes in around 7.5%. The composite score is 82 out of 100.

Properties like this exist because the market is inefficient. Not every buyer has access to the data that makes the discount visible. On a listing portal, this property looks like just another two-bed apartment at 178,000 EUR. Without the comparative analysis, you cannot see that it is significantly underpriced for its location and specification.

## The Catch

Not every high-discount property is a genuine bargain. The model can be wrong for reasons the data does not capture:

**Micro-location issues.** The property might face a busy road, a construction site, or have a compromised view that the data does not encode.

**Developer risk.** A low price might reflect the market's assessment of the developer's ability to deliver on time and to specification.

**Hidden costs.** Some developments have unusually high community fees or maintenance obligations that erode the value proposition.

This is why the score is a composite, not just a discount figure. A property with a 19% discount but a weak developer track record or poor location metrics might still score below 70. The discount is one input, not the whole picture.

## How to Use This

If you are actively searching for Spanish property, here is the workflow I recommend:

1. Start on avenaterminal.com and sort by discount percentage or overall score.
2. Identify properties in your budget range that show 10%+ discounts with scores above 70.
3. Research the town and developer independently. Visit if possible.
4. Cross-reference the yield estimate against actual Airbnb comparables in the area.
5. Only then engage with an agent or developer for the specific properties on your shortlist.

This inverts the traditional process. Instead of starting with an agent's recommendations and hoping the price is fair, you start with the data and verify on the ground.

The 19% discount properties do not stay available forever. In a market that is gradually becoming more transparent, the most underpriced listings attract attention faster. The data advantage is real, but it is temporary.

Full data at avenaterminal.com
