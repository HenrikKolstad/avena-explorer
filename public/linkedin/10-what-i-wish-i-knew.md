# What I Wish I Knew Before Building a PropTech Platform in Spain

Six months in, Avena Terminal tracks 1,881 properties, scores them daily, and serves a growing number of buyers and investors. If I could go back to day one, here is what I would tell myself.

## 1. The Data Is Messier Than You Think

I assumed that pulling listings from an MLS feed would give me clean, structured data. I was wrong.

Property descriptions mix languages. Square meter figures sometimes include terraces, sometimes do not. Bedroom counts occasionally include a study or a converted storage room. Prices may or may not include VAT (10% for new builds in Spain). Pool information is inconsistent -- some list it as an amenity, others bury it in the description text.

Cleaning and normalizing this data took more engineering effort than building the scoring model itself. If you are starting any data-driven real estate project, budget three times more time for data cleaning than you think you need.

## 2. Hedonic Models Need More Data Than You Expect

The hedonic regression model works well at 1,881 properties, but it was unreliable at 300. The town dummy variables need sufficient observations per town to produce stable coefficients. With only 5-10 listings in a town, the dummy variable is essentially fitting noise.

My initial model had wild price estimates for small towns. A single luxury villa in a town with only three other listings would skew the town coefficient upward, making everything else in that town look underpriced.

The solution was tier segmentation and minimum observation thresholds. Towns with fewer than 8 listings get grouped with nearby towns. Properties are classified into budget, mid, and premium tiers to prevent a single outlier from distorting the model.

Lesson: if you are building pricing models for fragmented markets, sample size per category matters more than total sample size.

## 3. Yield Estimates Are Political

Nobody argues with a price comparison. Show a buyer that their target property is priced 15% above the town average, and they accept the data.

Yield estimates are different. Everyone has an opinion on what occupancy rate to assume, what nightly rate to use, and what expenses to deduct. Agents who sell in a particular town will always argue that your yield estimate is too conservative. Property management companies will tell you it is too optimistic because you have not accounted for their fees.

At avenaterminal.com, I chose to be transparent about every assumption. The yield calculation shows the comparable properties used, the occupancy assumptions by season, and every cost deduction. If someone disagrees with an input, they can see exactly which one and why.

Radical transparency has been the best defense against political arguments about yield.

## 4. Your Users Know Things Your Model Does Not

The most valuable feedback I have received has come from actual buyers and property owners in specific towns. They tell me about the road construction project that will improve access in 2027. They share that a particular developer has a reputation for delayed completion. They point out that the beach listed at 2.3 km in our data requires walking down a cliff path that is impassable for elderly visitors.

This local knowledge is irreplaceable and impossible to capture in a data model. The best I can do is make the quantitative analysis so solid that users can layer their qualitative knowledge on top of it.

If you are building data products, create channels for user feedback. Your most engaged users are domain experts who will make your product better for free.

## 5. The Business Model Question Is Harder Than the Technical Problem

Building the scoring engine, cleaning the data, designing the interface -- those are hard engineering problems, but they are tractable. The harder question is: how does this become a sustainable business?

I deliberately chose not to accept advertising or developer sponsorships. The moment a platform takes money from listing parties, the incentive shifts from buyer transparency to seller promotion. That is exactly what I built this to avoid.

The current model at avenaterminal.com is free for buyers. The open dataset approach brings visibility and trust. The long-term business model is still evolving, but I am committed to keeping the core data and scoring free and independent.

## 6. Spain Has Unique Legal Complexity

Golden visas, NIE numbers, non-resident tax obligations, community of property rules, building licenses, energy performance certificates -- the legal landscape for property buyers in Spain is genuinely complex.

I initially thought the platform could stay purely data-focused. In practice, users need context about the buying process, not just property scores. We have started adding educational content about the legal and tax framework, without providing specific legal advice.

If you are building a PropTech product for a specific country, the legal and regulatory context is not optional. It is a core part of the user experience.

## 7. Timing Matters Less Than You Think

People ask me constantly whether now is a good time to buy in Spain. The honest answer from the data: it is almost always a decent time to buy a well-priced property in a good location. Timing the market is as difficult in property as it is in equities.

What matters more than market timing is property-level selection. The difference between a 65-score property and an 85-score property in the same town is worth more than any market timing advantage you might capture.

The data supports buying the right property at any time over buying any property at the right time.

## Looking Forward

Six months in, the dataset is larger, the model is more accurate, and the user base is growing. The biggest lesson is that building in public -- sharing the methodology, publishing the data, being transparent about limitations -- creates more trust and better feedback than any marketing campaign could.

If you are evaluating Spanish property, the data is open and free. If you are building something in PropTech, I am happy to share what I have learned.

Full data at avenaterminal.com
