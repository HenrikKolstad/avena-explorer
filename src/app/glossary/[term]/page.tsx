import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const revalidate = 86400;

/* ------------------------------------------------------------------ */
/*  Term data                                                          */
/* ------------------------------------------------------------------ */

interface TermData {
  slug: string;
  title: string;
  explanation: string;
  faqQ: string;
  faqA: string;
  related: string[]; // slugs
}

const TERMS: Record<string, TermData> = {
  'ibi-tax': {
    slug: 'ibi-tax',
    title: 'IBI Tax',
    explanation:
      'IBI (Impuesto sobre Bienes Inmuebles) is the annual property tax levied by every Spanish municipality. It is calculated as a percentage of the catastral value of the property, which is usually well below market value. Rates vary by town but typically range from 0.4% to 1.1%. IBI is payable once a year, usually between September and November, though some municipalities allow direct-debit instalments. Both residents and non-residents must pay IBI regardless of whether the property is occupied or rented out. When buying a property it is essential to verify that all IBI payments are up to date, as unpaid IBI can result in surcharges and even a lien on the property. Your gestor or lawyer can check this for you before completion. IBI receipts are also required when selling, as the notary will ask to see proof of payment. Budget roughly 0.3% to 0.8% of the purchase price per year for IBI, though this is only a guideline because catastral values differ widely.',
    faqQ: 'How much is IBI tax on a Spanish property?',
    faqA: 'IBI typically costs between 0.4% and 1.1% of the catastral value per year. For a property with a catastral value of 100,000 EUR you might pay 400 to 1,100 EUR annually, depending on the municipality.',
    related: ['catastro', 'referencia-catastral', 'community-fees'],
  },
  'nie-number': {
    slug: 'nie-number',
    title: 'NIE Number',
    explanation:
      'The NIE (Numero de Identificacion de Extranjero) is a unique identification number assigned to every foreigner who has financial, professional, or social dealings in Spain. It is required before you can buy property, open a bank account, sign a mortgage, pay taxes, or set up utilities. You can apply for an NIE at a Spanish consulate in your home country or at a National Police station in Spain. The process requires a completed EX-15 form, your passport, a passport-size photo, and proof of why you need it (such as a preliminary purchase contract). Processing times range from a few days to several weeks depending on location. Your NIE is permanent and does not expire, though the certificate itself has a three-month validity for certain procedures. Many buyers give their lawyer power of attorney to obtain the NIE on their behalf, which can save a trip to Spain. Without an NIE, no notary will complete a property purchase, making it the very first step in any Spanish property transaction.',
    faqQ: 'How do I get an NIE number for buying property in Spain?',
    faqA: 'Apply at a Spanish consulate abroad or at a National Police station in Spain. You need form EX-15, your passport, a photo, and proof of purpose such as a purchase contract. Processing takes days to weeks.',
    related: ['gestor', 'notario', 'escritura'],
  },
  'nota-simple': {
    slug: 'nota-simple',
    title: 'Nota Simple',
    explanation:
      'A Nota Simple is an official extract from the Spanish Land Registry (Registro de la Propiedad) that summarises the legal status of a property. It shows the registered owner, the property description, any charges or mortgages, and whether there are any legal encumbrances such as easements or embargoes. Requesting a Nota Simple is one of the first due-diligence steps when purchasing property in Spain. You can obtain one online through the Registradores.org website for a small fee, or your lawyer can request it. The document is typically issued within 24 to 48 hours. While a Nota Simple is informative and not a certificate of title, it gives buyers a reliable snapshot of the property\'s legal standing. Always check that the seller listed on the Nota Simple matches the person or entity selling the property. If a mortgage appears, confirm that it will be cancelled at or before completion. Lenders will also require a recent Nota Simple before approving a mortgage.',
    faqQ: 'What is a Nota Simple and why do I need one?',
    faqA: 'A Nota Simple is a Land Registry extract showing ownership, debts, and encumbrances on a Spanish property. It is essential due-diligence before buying, confirming the seller is the legal owner and the property is free of charges.',
    related: ['registro-propiedad', 'escritura', 'hipoteca'],
  },
  'off-plan': {
    slug: 'off-plan',
    title: 'Off-Plan Property',
    explanation:
      'Off-plan property refers to real estate purchased before or during construction, based on architectural plans and renders rather than a finished building. In Spain, off-plan purchases are common along the costas and typically offer lower entry prices compared to completed properties, plus the ability to customise finishes. Payments are usually staged: a reservation deposit, followed by instalments during construction, with the balance due on completion. Spanish law requires developers to provide a bank guarantee or insurance policy for all stage payments, protecting buyers if the developer fails to deliver. Completion timelines range from 12 to 30 months. Off-plan buyers benefit from brand-new builds with modern energy ratings and 10-year structural warranties. However, risks include construction delays, differences between renders and reality, and market fluctuations. Always verify the developer\'s track record, confirm the building licence (licencia de obra) is granted, and ensure your stage payments are protected by a bank guarantee (aval bancario) or insurance.',
    faqQ: 'Is buying off-plan property in Spain safe?',
    faqA: 'Yes, provided your stage payments are protected by a bank guarantee or insurance as required by Spanish law. Always verify the building licence and the developer\'s track record before committing.',
    related: ['key-ready', 'iva-new-build', 'licencia-primera-ocupacion'],
  },
  'key-ready': {
    slug: 'key-ready',
    title: 'Key Ready',
    explanation:
      'Key ready is a term used in the Spanish property market to describe a new-build home that is fully constructed, has received its Licencia de Primera Ocupacion, and is ready for immediate occupation. Unlike off-plan properties that require waiting for construction, a key-ready home allows you to move in or start renting as soon as the purchase completes. Key-ready properties often come fully fitted with kitchens, bathrooms, air conditioning, and sometimes furniture packages. They are popular with investors seeking immediate rental income and with lifestyle buyers who want certainty about what they are purchasing. Pricing is typically higher than off-plan equivalents because the developer has absorbed all construction risk and financing costs. When evaluating a key-ready property, confirm that the first-occupation licence has been issued, all community infrastructure is finished, and utility connections are live. Also check that any communal areas shown in marketing materials (pools, gardens, gyms) are completed.',
    faqQ: 'What does key ready mean for Spanish property?',
    faqA: 'Key ready means the property is fully built, has its first-occupation licence, and can be moved into immediately. It contrasts with off-plan, where you buy during construction.',
    related: ['off-plan', 'licencia-primera-ocupacion', 'cedula-habitabilidad'],
  },
  'community-fees': {
    slug: 'community-fees',
    title: 'Community Fees',
    explanation:
      'Community fees (gastos de comunidad) are monthly or quarterly charges paid by property owners in a shared development to cover the maintenance and upkeep of communal areas. These areas typically include swimming pools, gardens, lifts, stairwells, exterior lighting, and building insurance. Fees are set annually at the community of owners meeting (junta de propietarios) and are divided among owners according to their participation quota, which is written into the horizontal division deed. In coastal Spain, community fees for a standard apartment range from 50 to 200 EUR per month, while luxury complexes with concierge services and multiple pools can exceed 300 EUR monthly. When buying, always ask for the last two years of community minutes and accounts to check for planned special levies (derramas) for major works such as roof repairs or lift replacement. Unpaid community fees can become a debt attached to the property, so verify the seller is up to date before completing your purchase.',
    faqQ: 'How much are community fees in Spain?',
    faqA: 'Community fees for a standard coastal apartment range from 50 to 200 EUR per month. Luxury developments with extra amenities can charge 300 EUR or more. Fees cover pools, gardens, lifts, insurance, and building maintenance.',
    related: ['ibi-tax', 'contrato-compraventa', 'gestor'],
  },
  'plusvalia-tax': {
    slug: 'plusvalia-tax',
    title: 'Plusvalia Tax',
    explanation:
      'Plusvalia (Impuesto sobre el Incremento de Valor de los Terrenos de Naturaleza Urbana) is a municipal tax charged when a property changes ownership. It is calculated based on the increase in the land\'s catastral value during the seller\'s period of ownership, not on the actual sale price. Following a 2021 Constitutional Court ruling, plusvalia cannot be charged if the seller makes a loss on the sale. The tax is legally payable by the seller in a standard sale, though in practice buyer and seller sometimes negotiate who bears it. Rates and multipliers vary by municipality and length of ownership. For a typical resale property held for 10 years, plusvalia might amount to 1,000 to 5,000 EUR, but it can be higher in prime urban locations where catastral values have risen sharply. New-build purchases from a developer are also subject to plusvalia, though the amount is usually minimal because the developer\'s holding period is short. Your lawyer or gestor should calculate the estimated plusvalia before you list or sell.',
    faqQ: 'Who pays plusvalia tax in Spain?',
    faqA: 'The seller is legally responsible for plusvalia tax. It is a municipal tax based on the increase in land catastral value during ownership. Since 2021, it cannot be charged if the seller sells at a loss.',
    related: ['ibi-tax', 'catastro', 'impuesto-transmisiones'],
  },
  'escritura': {
    slug: 'escritura',
    title: 'Escritura',
    explanation:
      'The escritura (escritura publica de compraventa) is the public deed of sale that formalises a property transaction in Spain. It is signed before a notary (notario) by both buyer and seller, or their legal representatives acting under power of attorney. The notary reads out the deed, verifies identities, confirms the legal status of the property, and witnesses the exchange of payment. Once signed, the escritura is submitted to the Land Registry for inscription, which is what gives the buyer full legal protection as the registered owner. The process at the notary typically takes one to two hours. Costs include notary fees (gastos notariales), Land Registry fees, and applicable taxes. The notary keeps the original deed (matriz) and issues authorised copies (copias autorizadas) to the parties. It is critical that the escritura accurately reflects the true purchase price, as under-declaring was once common but now carries severe penalties and can cause problems with future capital gains calculations. Your lawyer should review the draft escritura before the signing day.',
    faqQ: 'What is an escritura in Spain?',
    faqA: 'An escritura is the official public deed of sale signed before a notary that transfers property ownership in Spain. It is then registered at the Land Registry to give the buyer full legal title.',
    related: ['notario', 'registro-propiedad', 'gastos-notariales'],
  },
  'registro-propiedad': {
    slug: 'registro-propiedad',
    title: 'Registro de la Propiedad',
    explanation:
      'The Registro de la Propiedad (Land Registry) is the official public register where property ownership, mortgages, and encumbrances are recorded in Spain. Registration is not mandatory but is strongly recommended because it provides the buyer with legal protection against third-party claims. Once your escritura is inscribed in the registro, your ownership is publicly recognised and protected by law. The registration process is handled by a registrador (registrar) and typically takes two to four weeks after the notary signing. Fees are regulated by a sliding scale based on the property value, usually ranging from 300 to 700 EUR. The registro also records mortgages, easements, legal charges, and any court orders affecting the property. Before buying, always obtain a Nota Simple from the registro to confirm the current state of the property. Each property in Spain is identified in the registro by a unique finca number. If a property is not registered, extra caution and legal advice are needed before proceeding.',
    faqQ: 'Is registering property in Spain mandatory?',
    faqA: 'Registration is not legally mandatory but is strongly advised. It protects the buyer against third-party claims and is required by banks if you need a mortgage. Registration typically costs 300 to 700 EUR.',
    related: ['nota-simple', 'escritura', 'notario'],
  },
  'notario': {
    slug: 'notario',
    title: 'Notario (Notary)',
    explanation:
      'A notario in Spain is a public official authorised by the state to authenticate legal documents and transactions. In property purchases, the notary oversees the signing of the escritura, verifies the identities of all parties, checks that the property is free of undisclosed charges, and ensures taxes and fees are correctly addressed. Unlike in some countries, Spanish notaries are impartial and do not represent either the buyer or the seller. The buyer has the right to choose which notary to use. Notary fees are regulated by the Spanish government and are based on a sliding scale related to the property price, typically ranging from 600 to 1,500 EUR. The notary also handles anti-money-laundering checks and reports the transaction to the tax authorities. While the notary provides important legal safeguards, they do not replace the role of an independent lawyer. Buyers should always have their own abogado (lawyer) review contracts and conduct due diligence, as the notary\'s role is limited to the formal aspects of the transaction.',
    faqQ: 'Do I need a notary to buy property in Spain?',
    faqA: 'Yes. All property sales in Spain must be formalised before a notary who authenticates the deed of sale (escritura). The buyer chooses the notary, and fees typically range from 600 to 1,500 EUR.',
    related: ['escritura', 'gastos-notariales', 'poder-notarial'],
  },
  'gestor': {
    slug: 'gestor',
    title: 'Gestor',
    explanation:
      'A gestor (gestor administrativo) is a licensed professional in Spain who handles bureaucratic and administrative procedures on behalf of clients. For property buyers, a gestor can obtain your NIE number, register utilities, file tax returns, handle vehicle transfers, and manage other paperwork with government agencies. Gestors are especially valuable for foreigners unfamiliar with Spanish bureaucracy and language. They differ from lawyers (abogados) in that they focus on administrative processes rather than legal advice or contract review. Many property investors use both a lawyer for legal due diligence and a gestor for ongoing administrative tasks like filing the annual non-resident tax return (Modelo 210) and managing IBI payments. Gestor fees are generally modest, ranging from 50 to 300 EUR per task depending on complexity. In the costas, many gestors are bilingual or multilingual. When choosing a gestor, verify they are registered with the Colegio de Gestores Administrativos. A reliable gestor can save significant time and frustration navigating Spain\'s often complex administrative systems.',
    faqQ: 'What is the difference between a gestor and a lawyer in Spain?',
    faqA: 'A gestor handles administrative paperwork like NIE applications, tax filings, and utility setup. A lawyer (abogado) provides legal advice, reviews contracts, and conducts due diligence. Most buyers use both.',
    related: ['nie-number', 'modelo-210', 'declaracion-renta'],
  },
  'poder-notarial': {
    slug: 'poder-notarial',
    title: 'Poder Notarial (Power of Attorney)',
    explanation:
      'A poder notarial (power of attorney) is a legal document that authorises another person to act on your behalf in Spain. For property transactions, buyers who cannot be present in Spain for every step often grant power of attorney to their lawyer, allowing the lawyer to sign contracts, complete the escritura, pay taxes, and handle registration. Powers of attorney can be general (covering a broad range of actions) or specific (limited to a particular transaction). For property purchases, a specific power of attorney is recommended to limit the scope of authority. The document must be notarised, either at a Spanish notary or at a notary in your home country with an apostille and sworn translation. If granted abroad, the Spanish consulate can also notarise it. The cost of a poder notarial in Spain is typically 50 to 150 EUR. It is essential that the power of attorney is drafted carefully to cover all necessary actions, including signing the escritura, paying taxes, connecting utilities, and registering the property. Powers of attorney can be revoked at any time.',
    faqQ: 'Do I need a power of attorney to buy property in Spain?',
    faqA: 'Not if you attend all signings in person. However, granting power of attorney to your lawyer allows them to handle the purchase process on your behalf if you cannot travel to Spain for each step.',
    related: ['notario', 'escritura', 'gestor'],
  },
  'impuesto-transmisiones': {
    slug: 'impuesto-transmisiones',
    title: 'Impuesto de Transmisiones Patrimoniales',
    explanation:
      'Impuesto de Transmisiones Patrimoniales (ITP) is the transfer tax paid by the buyer when purchasing a resale property in Spain. It does not apply to new builds, which are subject to IVA instead. ITP rates vary by autonomous community and typically range from 6% to 10% of the declared purchase price. In the Valencian Community the rate is 10%, in Andalusia it is 7%, and in Catalonia it is 10% for properties above certain thresholds. The tax must be paid within 30 days of signing the escritura, and your lawyer or gestor usually handles the filing. Failure to pay on time results in surcharges and interest. The tax authorities may reassess the declared price if they consider it below market value, potentially leading to an additional tax bill. To avoid this, ensure the price declared in the escritura reflects the true transaction value. For investors, ITP is a significant acquisition cost that affects overall yield calculations. It is not recoverable and should be factored into your total investment budget alongside notary fees, registry fees, and legal costs.',
    faqQ: 'How much is transfer tax (ITP) on a Spanish resale property?',
    faqA: 'ITP varies by region, generally 6% to 10% of the purchase price. Valencia charges 10%, Andalusia 7%. It applies only to resale properties and must be paid within 30 days of signing the deed.',
    related: ['iva-new-build', 'escritura', 'impuesto-actos-juridicos'],
  },
  'iva-new-build': {
    slug: 'iva-new-build',
    title: 'IVA on New Builds',
    explanation:
      'IVA (Impuesto sobre el Valor Anadido) is Spain\'s value added tax, charged at 10% on new-build residential property purchases. This replaces the transfer tax (ITP) that applies to resale properties. In addition to the 10% IVA, new-build buyers must also pay Impuesto de Actos Juridicos Documentados (AJD, stamp duty) at a rate that varies by region, typically 1% to 1.5%. For properties in the Canary Islands, the equivalent tax is IGIC at 6.5% instead of IVA. Commercial properties attract IVA at the standard 21% rate. IVA on new builds is payable to the developer at completion, who then remits it to the tax authorities. Unlike ITP, which can sometimes be negotiated down through lower price declarations (though this is illegal and risky), IVA is applied to the full invoice amount with no ambiguity. For investment calculations, budget 10% IVA plus 1% to 1.5% AJD on top of the purchase price for any new-build purchase on mainland Spain. This makes the total tax burden for new builds roughly 11% to 11.5%, compared with 6% to 10% ITP for resales.',
    faqQ: 'What tax do you pay on a new build in Spain?',
    faqA: 'New-build properties carry 10% IVA (VAT) plus 1% to 1.5% stamp duty (AJD), totalling roughly 11% to 11.5% on top of the purchase price. Resale properties pay ITP instead.',
    related: ['impuesto-transmisiones', 'impuesto-actos-juridicos', 'off-plan'],
  },
  'cedula-habitabilidad': {
    slug: 'cedula-habitabilidad',
    title: 'Cedula de Habitabilidad',
    explanation:
      'The cedula de habitabilidad (habitability certificate) is an official document issued by the regional government confirming that a dwelling meets the minimum standards for human habitation. These standards cover aspects such as minimum room sizes, ceiling heights, ventilation, natural light, sanitation, and access to water and electricity. The certificate is required in several autonomous communities (though not all) for connecting utilities, registering a rental contract, and completing a property sale. It is issued after an architect inspects the property and certifies compliance. For new builds, the developer obtains the cedula as part of the completion process, alongside the licencia de primera ocupacion. For resale properties, the seller should provide a valid cedula, which typically has a validity of 10 to 25 years depending on the region. In some communities like Catalonia and Valencia, a cedula is mandatory for any property sale. If it has expired, the seller must arrange a new inspection and certificate before completion. The cost of obtaining a new cedula is usually 100 to 250 EUR including the architect\'s fee.',
    faqQ: 'What is a cedula de habitabilidad in Spain?',
    faqA: 'It is a habitability certificate confirming a property meets minimum living standards. Required in many regions for utility connections, rental contracts, and sales. Valid for 10 to 25 years depending on the community.',
    related: ['licencia-primera-ocupacion', 'key-ready', 'catastro'],
  },
  'licencia-primera-ocupacion': {
    slug: 'licencia-primera-ocupacion',
    title: 'Licencia de Primera Ocupacion',
    explanation:
      'The licencia de primera ocupacion (first occupation licence) is a permit issued by the local town hall (ayuntamiento) confirming that a newly built property has been constructed in accordance with the approved building plans and complies with local planning regulations. Without this licence, the property cannot legally be occupied, utilities cannot be permanently connected, and the property cannot be registered at the Land Registry in some regions. For new-build buyers, the developer is responsible for obtaining the licence after construction is complete, and it is a condition precedent for the final payment and key handover. Delays in obtaining the licence are a common source of frustration, as municipal inspections and paperwork can take months. If you are buying off-plan, your contract should include a clause addressing what happens if the licence is delayed beyond the expected completion date. The licence confirms that the building complies with structural, safety, accessibility, and environmental standards. It is closely related to the cedula de habitabilidad, and in some regions one document serves both purposes.',
    faqQ: 'What is a licencia de primera ocupacion?',
    faqA: 'It is a licence from the town hall confirming a new build complies with approved plans and can be legally occupied. Required for permanent utility connections and often for Land Registry inscription.',
    related: ['cedula-habitabilidad', 'off-plan', 'key-ready'],
  },
  'catastro': {
    slug: 'catastro',
    title: 'Catastro',
    explanation:
      'The Catastro is Spain\'s official land and property registry managed by the Ministry of Finance (Hacienda). It records the physical characteristics of every property in Spain, including its location, boundaries, size, use, and catastral value. The catastral value is an administrative valuation used to calculate several taxes including IBI (annual property tax), plusvalia (municipal capital gains tax), and certain income tax obligations for non-residents. Catastral values are typically 30% to 50% of market value, though this ratio varies significantly by municipality and when the area was last revalued. Every property has a unique 20-digit referencia catastral that identifies it in the system. You can look up any property on the Catastro website (sedecatastro.gob.es) using the address or referencia catastral. The Catastro is separate from the Registro de la Propiedad (Land Registry). While the Land Registry records legal ownership and charges, the Catastro records physical and fiscal characteristics. Discrepancies between the two are common and should be resolved before completing a purchase.',
    faqQ: 'What is the difference between the Catastro and the Land Registry in Spain?',
    faqA: 'The Catastro records physical characteristics and tax valuations of properties. The Land Registry (Registro de la Propiedad) records legal ownership and charges. Both are separate systems and discrepancies should be checked.',
    related: ['referencia-catastral', 'ibi-tax', 'registro-propiedad'],
  },
  'referencia-catastral': {
    slug: 'referencia-catastral',
    title: 'Referencia Catastral',
    explanation:
      'The referencia catastral is a unique 20-character alphanumeric code assigned to every property in Spain by the Catastro (land and property registry). It serves as the property\'s official identification number for tax and administrative purposes. The reference is composed of several segments encoding the province, municipality, zone, plot, and specific unit within a building. You can find a property\'s referencia catastral on IBI receipts, the escritura, or by searching the Catastro website (sedecatastro.gob.es) using the property address. The referencia catastral is essential for tax filings, utility connections, and verifying that the physical property matches official records. When buying, always check that the referencia catastral matches the property being sold and that the Catastro description (size, number of rooms, boundaries) is accurate. Discrepancies between the Catastro and the Land Registry are common, especially for older properties or those that have been extended without proper permissions. Resolving these discrepancies may require a surveyor and additional documentation.',
    faqQ: 'Where do I find the referencia catastral of a Spanish property?',
    faqA: 'Check the IBI tax receipt, the property deed (escritura), or search by address on the official Catastro website at sedecatastro.gob.es. It is a 20-character code unique to each property.',
    related: ['catastro', 'ibi-tax', 'nota-simple'],
  },
  'hipoteca': {
    slug: 'hipoteca',
    title: 'Hipoteca (Mortgage)',
    explanation:
      'A hipoteca is a mortgage (secured property loan) in Spain. Spanish banks offer mortgages to both residents and non-residents, though terms differ. Residents can typically borrow up to 80% of the appraised value (tasacion), while non-residents are usually limited to 60% to 70%. Mortgage types include fixed-rate, variable-rate (linked to the Euribor index), and mixed products. Since the 2019 Mortgage Law, the bank pays most mortgage setup costs and the borrower only pays the tasacion fee. Typical variable-rate mortgages are priced at Euribor plus 0.8% to 1.5%, while fixed rates have ranged from 2.5% to 4% depending on market conditions. Mortgage terms can extend up to 25 to 30 years, with the loan generally needing to be repaid before the borrower turns 75. To apply, you will need proof of income, tax returns, bank statements, an employment contract or business accounts, and a property valuation. The bank will also check your credit history in Spain and possibly in your home country. Getting a mortgage pre-approval before property hunting gives you a clear budget and strengthens your negotiating position.',
    faqQ: 'Can foreigners get a mortgage in Spain?',
    faqA: 'Yes. Non-residents can typically borrow 60% to 70% of the appraised property value from Spanish banks. You will need proof of income, tax returns, bank statements, and a property valuation (tasacion).',
    related: ['tasacion', 'nota-simple', 'escritura'],
  },
  'tasacion': {
    slug: 'tasacion',
    title: 'Tasacion (Valuation)',
    explanation:
      'A tasacion is an official property valuation carried out by a certified appraisal company (sociedad de tasacion) registered with the Bank of Spain. It is required by banks when granting a mortgage and determines the maximum loan amount. The tasacion assesses the property\'s market value based on comparable sales, location, condition, size, and other factors. The cost of a tasacion ranges from 250 to 600 EUR depending on the property type and value, and since the 2019 Mortgage Law it is the only mortgage-related fee the borrower must pay. The valuation is valid for six months. If the tasacion comes in below the purchase price, the bank will lend based on the lower value, meaning the buyer needs to cover the difference. For new builds, the appraiser also considers the developer\'s specification and completion status. Even if you are not taking a mortgage, commissioning a tasacion can be useful to confirm you are paying a fair price. The appraisal company must be independent and cannot be the same entity as the lender. Your bank will usually suggest an approved appraiser, but you have the right to choose your own from the Bank of Spain\'s registry.',
    faqQ: 'How much does a property valuation (tasacion) cost in Spain?',
    faqA: 'A tasacion typically costs 250 to 600 EUR. It is carried out by a certified appraisal company and is required by banks for mortgage approval. The borrower pays this fee.',
    related: ['hipoteca', 'escritura', 'nota-simple'],
  },
  'arras-contract': {
    slug: 'arras-contract',
    title: 'Arras Contract',
    explanation:
      'An arras contract (contrato de arras) is a preliminary agreement between buyer and seller that reserves a property and establishes the terms of the future sale. The most common type is arras penitenciales, which allows either party to withdraw: if the buyer pulls out, they forfeit the deposit; if the seller pulls out, they must return double the deposit. The deposit is typically 10% of the purchase price, though this is negotiable. The arras contract specifies the agreed price, completion deadline, property details, and any conditions (such as obtaining a mortgage). It is a binding agreement with financial consequences for breach. The contract should be reviewed by your lawyer before signing. Less common types include arras confirmatorias (where withdrawal is not allowed and breach leads to damages claims) and arras penales (where a penalty is agreed for breach but the contract remains enforceable). The arras deposit is deducted from the final purchase price at completion. Always ensure the contract clearly states which type of arras applies, as the legal consequences differ significantly. A well-drafted arras contract protects both parties during the period between agreement and notary completion.',
    faqQ: 'What happens if I withdraw from an arras contract in Spain?',
    faqA: 'Under arras penitenciales (the most common type), the buyer loses the deposit if they withdraw. If the seller withdraws, they must pay the buyer double the deposit amount.',
    related: ['contrato-compraventa', 'escritura', 'notario'],
  },
  'contrato-compraventa': {
    slug: 'contrato-compraventa',
    title: 'Contrato de Compraventa',
    explanation:
      'The contrato de compraventa is the private purchase contract between buyer and seller that sets out all the terms and conditions of a property sale in Spain. While the arras contract is a preliminary reservation agreement, the contrato de compraventa is a more detailed document that may serve as the definitive private agreement before the notary signing. It typically includes the full names and identification of both parties, a detailed property description including the referencia catastral, the agreed price and payment schedule, the completion date, a list of fixtures and fittings included, declarations about the property\'s legal status, and penalty clauses for breach. For new-build purchases from developers, this contract is particularly important as it details the specification, payment stages, completion timeline, bank guarantees for stage payments, and penalty clauses for delays. Your lawyer should review (or ideally draft) this contract to ensure your interests are protected. Key items to verify include that the seller declares the property free of charges, that community fees and IBI are paid up to date, and that the contract specifies who pays which closing costs.',
    faqQ: 'What is a contrato de compraventa?',
    faqA: 'It is the private purchase contract setting out all terms of a Spanish property sale, including price, payment schedule, property details, and conditions. It precedes the public deed (escritura) signed at the notary.',
    related: ['arras-contract', 'escritura', 'notario'],
  },
  'gastos-notariales': {
    slug: 'gastos-notariales',
    title: 'Gastos Notariales',
    explanation:
      'Gastos notariales refers to the fees charged by the notary (notario) for authenticating and formalising the property deed (escritura). In Spain, notary fees are regulated by the government through a tariff schedule based on the property value, so they are broadly similar regardless of which notary you choose. For a property purchase of 250,000 EUR, notary fees are typically 800 to 1,200 EUR. The fee covers the preparation of the deed, reading it to the parties, verifying identities, checking the property\'s legal status, and archiving the original document. In addition to the notary fees, buyers should budget for Land Registry fees (400 to 700 EUR for a similar property value) and the gestoria fee for handling the registration and tax filing (300 to 500 EUR). Together, these administrative costs typically add 0.5% to 1% of the purchase price on top of the applicable taxes. Since the 2019 Mortgage Law, the bank pays the notary fees for the mortgage deed, meaning the buyer only pays the notary fees for the purchase deed itself. Your lawyer or gestoria will usually handle collecting and paying these fees on your behalf from funds held in their client account.',
    faqQ: 'How much are notary fees when buying property in Spain?',
    faqA: 'Notary fees are government-regulated and typically range from 800 to 1,200 EUR for a property worth 250,000 EUR. They cover preparing and authenticating the deed of sale.',
    related: ['notario', 'escritura', 'registro-propiedad'],
  },
  'impuesto-actos-juridicos': {
    slug: 'impuesto-actos-juridicos',
    title: 'Impuesto de Actos Juridicos Documentados',
    explanation:
      'Impuesto de Actos Juridicos Documentados (AJD), commonly known as stamp duty, is a tax levied on notarised documents in Spain. For property purchases, it applies specifically to new-build transactions (which are subject to IVA) and to mortgage deeds. The rate varies by autonomous community, typically ranging from 0.5% to 1.5% of the documented value. In the Valencian Community the rate is 1.5%, in Andalusia 1.2%, and in Madrid 0.75%. AJD on the purchase deed is paid by the buyer, while AJD on the mortgage deed has been paid by the bank since the 2019 Mortgage Law. The tax must be filed and paid within 30 days of the notary signing. For resale purchases, AJD does not apply because those transactions are taxed under ITP instead. This is an important distinction: new builds attract IVA plus AJD, while resales attract ITP only. When budgeting for a new-build purchase, include both 10% IVA and the applicable AJD rate to calculate your total tax liability. Your gestoria or lawyer will prepare and file the AJD declaration on your behalf.',
    faqQ: 'When do you pay stamp duty (AJD) in Spain?',
    faqA: 'AJD applies to new-build purchases (alongside IVA) and mortgage deeds. Rates range from 0.5% to 1.5% by region. Since 2019, the bank pays AJD on mortgage deeds; the buyer pays AJD on the purchase deed.',
    related: ['iva-new-build', 'impuesto-transmisiones', 'gastos-notariales'],
  },
  'residencia-fiscal': {
    slug: 'residencia-fiscal',
    title: 'Residencia Fiscal',
    explanation:
      'Residencia fiscal (tax residency) determines which country has the primary right to tax your worldwide income. In Spain, you are considered a tax resident if you spend more than 183 days per calendar year in the country, if Spain is the centre of your economic interests, or if your spouse and dependent children reside in Spain. Tax residents must declare and pay tax on their worldwide income using the annual declaracion de la renta (income tax return). Non-residents owning Spanish property still have tax obligations: they must file an annual Modelo 210 declaring either imputed income (if the property is not rented) or rental income. Non-residents pay a flat 19% tax on rental income (for EU/EEA citizens) or 24% (for non-EU citizens), while residents pay progressive rates from 19% to 47%. Spain has double taxation treaties with many countries to prevent being taxed twice on the same income. Before making a move, it is advisable to consult a tax advisor familiar with both Spanish tax law and the tax regime of your home country. Getting your residencia fiscal status wrong can lead to penalties and unexpected tax bills in both jurisdictions.',
    faqQ: 'When are you tax resident in Spain?',
    faqA: 'You become tax resident in Spain if you spend more than 183 days per year there, if Spain is the centre of your economic interests, or if your spouse and dependent children reside in Spain.',
    related: ['declaracion-renta', 'modelo-210', 'golden-visa-spain'],
  },
  'golden-visa-spain': {
    slug: 'golden-visa-spain',
    title: 'Golden Visa Spain',
    explanation:
      'The Spanish Golden Visa programme grants residency permits to non-EU nationals who make a significant investment in Spain. The most common route is purchasing real estate worth 500,000 EUR or more. The investment must be free of any mortgage or charge up to the 500,000 EUR threshold (though you can borrow above that amount). The visa grants the holder the right to live and work in Spain and travel freely within the Schengen zone. It is initially valid for two years and can be renewed for five-year periods, provided the investment is maintained. There is no minimum stay requirement to maintain the visa, making it attractive for investors who do not plan to live full-time in Spain. Family members (spouse, dependent children, and dependent parents) can also obtain residency under the same application. The programme has been subject to political debate regarding its impact on housing markets, and changes or termination are possible in the future. To apply, you need to show proof of the investment, a clean criminal record, health insurance, and sufficient financial means. Processing typically takes 20 to 60 days. The Golden Visa does not automatically make you a tax resident; that depends on your actual days spent in Spain.',
    faqQ: 'How much do you need to invest for a Golden Visa in Spain?',
    faqA: 'The minimum real estate investment is 500,000 EUR, which must be free of mortgage up to that threshold. The visa grants residency with no minimum stay requirement and includes family members.',
    related: ['residencia-fiscal', 'nie-number', 'hipoteca'],
  },
  'autonomo-spain': {
    slug: 'autonomo-spain',
    title: 'Autonomo (Self-Employed) in Spain',
    explanation:
      'An autonomo is a self-employed individual registered with the Spanish tax authorities (Hacienda) and social security system (Seguridad Social). If you plan to earn income from professional activities while living in Spain, registering as autonomo is usually required. This applies to freelancers, consultants, sole traders, and anyone providing services independently. The registration process involves obtaining a NIE, registering with Hacienda using form 036 or 037, and signing up for the RETA (Regimen Especial de Trabajadores Autonomos) social security scheme. Monthly social security contributions are based on your chosen contribution base and range from around 230 to 530 EUR per month under the new 2023 system, which links contributions to actual income. New autonomos benefit from a reduced flat rate (tarifa plana) of around 80 EUR per month for the first 12 months. Autonomos must file quarterly VAT (IVA) returns using form 303 and quarterly income tax prepayments using form 130. An annual income tax return is also required. Many property investors register as autonomo if they actively manage their rental properties or provide related services. Using a gestor to handle autonomo paperwork and tax filings is highly recommended.',
    faqQ: 'How much does it cost to be autonomo in Spain?',
    faqA: 'Monthly social security contributions range from about 230 to 530 EUR based on income, with a reduced rate of around 80 EUR per month for the first year. Quarterly tax filings are also required.',
    related: ['gestor', 'declaracion-renta', 'sociedad-limitada'],
  },
  'sociedad-limitada': {
    slug: 'sociedad-limitada',
    title: 'Sociedad Limitada (S.L.)',
    explanation:
      'A Sociedad Limitada (S.L.) is Spain\'s equivalent of a limited liability company and is the most common corporate structure for small and medium businesses. Some property investors choose to buy through an S.L. for tax planning, liability protection, or portfolio management purposes. Setting up an S.L. requires a minimum share capital of 3,000 EUR, a unique company name reserved through the Central Mercantile Registry, articles of association drafted by a lawyer, and a notary deed of incorporation. The process takes two to four weeks and costs approximately 1,500 to 3,000 EUR in fees. An S.L. pays corporate tax (impuesto de sociedades) at 25% on profits, compared with personal income tax rates of up to 47% for individuals. However, extracting profits as dividends incurs additional taxation. An S.L. also has annual accounting obligations, including filing accounts with the Mercantile Registry and submitting corporate tax returns. For property holding, an S.L. can be advantageous for larger portfolios, succession planning, or when multiple investors are involved. However, for a single property the added costs and complexity may outweigh the tax benefits. Professional tax advice is essential before deciding between personal and corporate ownership.',
    faqQ: 'Should I buy Spanish property through an S.L. company?',
    faqA: 'An S.L. can offer tax and liability advantages for larger property portfolios but adds cost and complexity. For a single property, personal ownership is usually simpler. Consult a Spanish tax advisor.',
    related: ['autonomo-spain', 'declaracion-renta', 'residencia-fiscal'],
  },
  'declaracion-renta': {
    slug: 'declaracion-renta',
    title: 'Declaracion de la Renta',
    explanation:
      'The declaracion de la renta is Spain\'s annual income tax return (Impuesto sobre la Renta de las Personas Fisicas, or IRPF). Tax residents in Spain must file this return declaring their worldwide income, including salary, rental income, capital gains, interest, dividends, and other sources. The filing period is typically April to June for the previous tax year. Spain uses progressive tax rates ranging from 19% on the first 12,450 EUR to 47% on income above 300,000 EUR, with rates varying slightly by autonomous community. Allowable deductions include mortgage interest on your primary residence (for pre-2013 mortgages), contributions to pension plans, and certain personal and family allowances. Rental income can be offset by allowable expenses such as mortgage interest, repairs, insurance, IBI, community fees, and depreciation. For residents renting out property within Spain, a 60% reduction on net rental income applies for long-term residential lets. The tax agency (Agencia Tributaria) provides an online draft (borrador) that pre-fills much of the return from employer and bank data. Non-residents do not file the declaracion de la renta but must file Modelo 210 instead for their Spanish-source income.',
    faqQ: 'Do I have to file a tax return in Spain?',
    faqA: 'Tax residents earning above the minimum threshold must file the annual declaracion de la renta (April to June). Non-residents with Spanish property file Modelo 210 instead for imputed or rental income.',
    related: ['modelo-210', 'residencia-fiscal', 'gestor'],
  },
  'modelo-210': {
    slug: 'modelo-210',
    title: 'Modelo 210',
    explanation:
      'Modelo 210 is the tax form that non-resident property owners in Spain must file to declare income arising from their Spanish property. There are two main scenarios. First, if the property is rented out, you must file a Modelo 210 for each quarter in which rental income is received, declaring the gross rent and (for EU/EEA residents) deducting allowable expenses to arrive at taxable income. The tax rate is 19% for EU/EEA residents and 24% for non-EU residents. Second, if the property is not rented and is kept for personal use, you must file an annual Modelo 210 declaring imputed income, calculated as 1.1% or 2% of the catastral value (depending on when it was last revised), taxed at 19% or 24%. The filing deadline for imputed income is December 31 of the year following the tax year. Many non-resident owners are unaware of this obligation, but the Spanish tax authorities are increasingly enforcing compliance. Penalties for late filing include surcharges of 5% to 20% plus interest. Most non-residents engage a gestor or fiscal representative to handle their Modelo 210 filings, which typically costs 75 to 150 EUR per filing.',
    faqQ: 'Do non-residents in Spain have to pay tax on property they own?',
    faqA: 'Yes. Non-residents must file Modelo 210 annually for imputed income (if not rented) or quarterly for rental income. The tax rate is 19% for EU/EEA citizens or 24% for non-EU citizens.',
    related: ['declaracion-renta', 'residencia-fiscal', 'gestor'],
  },
};

const TERM_SLUGS = Object.keys(TERMS);

function slugToLabel(slug: string): string {
  return TERMS[slug]?.title ?? slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

/* ------------------------------------------------------------------ */
/*  Static params                                                      */
/* ------------------------------------------------------------------ */

export function generateStaticParams() {
  return TERM_SLUGS.map((t) => ({ term: t }));
}

/* ------------------------------------------------------------------ */
/*  Metadata                                                           */
/* ------------------------------------------------------------------ */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ term: string }>;
}): Promise<Metadata> {
  const { term } = await params;
  const data = TERMS[term];
  if (!data) return {};

  const title = `${data.title} — Spanish Property Glossary | Avena Terminal`;
  const description = data.explanation.slice(0, 155) + '...';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://avenaterminal.com/glossary/${term}`,
      siteName: 'Avena Terminal',
      type: 'article',
    },
    alternates: { canonical: `https://avenaterminal.com/glossary/${term}` },
  };
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default async function GlossaryTermPage({
  params,
}: {
  params: Promise<{ term: string }>;
}) {
  const { term } = await params;
  const data = TERMS[term];
  if (!data) notFound();

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: data.faqQ,
        acceptedAnswer: {
          '@type': 'Answer',
          text: data.faqA,
        },
      },
    ],
  };

  return (
    <>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      </head>

      <div className="min-h-screen bg-gray-950 text-gray-100">
        {/* Breadcrumbs */}
        <nav className="max-w-3xl mx-auto px-4 pt-6 text-sm text-gray-500">
          <Link href="/" className="hover:text-emerald-400 transition-colors">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/glossary" className="hover:text-emerald-400 transition-colors">
            Glossary
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-300">{data.title}</span>
        </nav>

        <main className="max-w-3xl mx-auto px-4 py-10">
          <h1 className="text-3xl sm:text-4xl font-bold mb-6">
            {data.title} — Spanish Property Glossary
          </h1>

          <article className="prose prose-invert prose-emerald max-w-none">
            <p className="text-gray-300 leading-relaxed text-lg">{data.explanation}</p>
          </article>

          {/* FAQ section */}
          <div className="mt-10 rounded-xl bg-gray-900 border border-gray-800 p-6">
            <h2 className="text-lg font-semibold text-emerald-400 mb-3">
              Frequently Asked Question
            </h2>
            <p className="font-medium text-white mb-2">{data.faqQ}</p>
            <p className="text-gray-400">{data.faqA}</p>
          </div>

          {/* Related terms */}
          {data.related.length > 0 && (
            <div className="mt-10">
              <h2 className="text-lg font-semibold text-gray-300 mb-3">Related Terms</h2>
              <div className="flex flex-wrap gap-2">
                {data.related.map((slug) => (
                  <Link
                    key={slug}
                    href={`/glossary/${slug}`}
                    className="inline-block rounded-lg bg-gray-900 border border-gray-800 px-4 py-2 text-sm font-medium text-emerald-400 hover:border-emerald-600 transition-colors"
                  >
                    {slugToLabel(slug)}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Back link */}
          <div className="mt-12">
            <Link
              href="/glossary"
              className="text-emerald-400 hover:text-emerald-300 text-sm font-medium transition-colors"
            >
              &larr; Back to full glossary
            </Link>
          </div>
        </main>
      </div>
    </>
  );
}
