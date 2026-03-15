-- Slice Properties — Quiz Seed Data
-- 25 Florida Real Estate License Exam Questions
-- Run AFTER schema.sql

INSERT INTO quiz_questions (question, options, correct_index, explanation, category) VALUES

-- LICENSING
('How many hours of pre-license education are required for a Florida real estate sales associate license?',
 '["45 hours", "63 hours", "72 hours", "100 hours"]', 1,
 'Florida requires 63 hours of pre-license education for sales associate candidates (Course I).',
 'licensing'),

('What is the minimum age requirement to obtain a Florida real estate sales associate license?',
 '["16 years old", "18 years old", "21 years old", "No minimum age"]', 1,
 'Applicants must be at least 18 years old to obtain a Florida real estate sales associate license.',
 'licensing'),

('How long is a Florida real estate license application valid after the state exam is passed?',
 '["6 months", "1 year", "2 years", "Indefinitely"]', 2,
 'An application for a Florida real estate license is valid for two years from the date the application was filed.',
 'licensing'),

('What is the required post-license education for a Florida sales associate during the first renewal period?',
 '["14 hours", "28 hours", "45 hours", "63 hours"]', 2,
 'Florida sales associates must complete 45 hours of post-license education before their first license renewal.',
 'licensing'),

('Who regulates Florida real estate licensees?',
 '["Department of Business and Professional Regulation (DBPR)", "Florida Real Estate Association (FREA)", "National Association of Realtors (NAR)", "Florida Department of State"]', 0,
 'The DBPR, through the Florida Real Estate Commission (FREC), regulates real estate licensees in Florida.',
 'licensing'),

-- ESCROW
('In Florida, how long does a broker have to deposit earnest money into an escrow account after receiving it?',
 '["Immediately", "3 business days", "5 business days", "7 calendar days"]', 1,
 'Florida law requires brokers to deposit earnest money into an escrow account within 3 business days of receipt.',
 'escrow'),

('Which of the following is NOT an acceptable Florida escrow dispute resolution method?',
 '["Mediation", "Arbitration", "Litigation", "Verbal agreement between parties"]', 3,
 'Florida provides four settlement procedures for escrow disputes: mediation, arbitration, interpleader, and escrow disbursement order (EDO). A verbal agreement is not an official procedure.',
 'escrow'),

('A Florida broker who holds escrow funds in a dispute can request which of the following from FREC?',
 '["A court order", "An Escrow Disbursement Order (EDO)", "A mediation settlement", "An arbitration award"]', 1,
 'A broker may request an Escrow Disbursement Order (EDO) from FREC when there is a dispute over escrow funds.',
 'escrow'),

('What must a Florida broker do within 15 business days of receiving conflicting demands for escrow funds?',
 '["Return the funds to the buyer", "Notify FREC of the dispute", "File an interpleader action", "Release the funds to the seller"]', 1,
 'Florida brokers must notify FREC in writing within 15 business days after the last party makes a demand on the escrowed funds.',
 'escrow'),

-- AGENCY
('In a Florida real estate transaction, a transaction broker owes which duties to both parties?',
 '["Fiduciary duties only", "Limited representation duties including dealing honestly and fairly", "No duties whatsoever", "Full undivided loyalty to both parties"]', 1,
 'A transaction broker provides limited representation, owing duties such as dealing honestly and fairly, accounting for funds, and using skill, care, and diligence.',
 'agency'),

('What type of agency relationship gives a Florida licensee full fiduciary duties to the client?',
 '["Transaction broker", "Single agent", "Non-representation", "Dual agency"]', 1,
 'A single agent relationship gives the licensee the highest level of fiduciary duties, including loyalty, confidentiality, and obedience.',
 'agency'),

('Florida''s default brokerage relationship, when no other relationship is established, is:',
 '["Single agent", "Dual agent", "Transaction broker", "Non-representation"]', 2,
 'In Florida, the transaction broker relationship is the default brokerage relationship when no other relationship has been established.',
 'agency'),

('Which of the following must a Florida licensee disclose to a customer when operating as a transaction broker?',
 '["The seller''s minimum acceptable price", "That the buyer is pre-approved for a higher amount", "That the licensee is acting as a transaction broker", "The seller''s reason for selling"]', 2,
 'Licensees must disclose the nature of the brokerage relationship. A transaction broker must disclose that they are providing limited representation.',
 'agency'),

-- FAIR HOUSING
('Under the Federal Fair Housing Act, which protected class was added by the 1988 amendment?',
 '["Race and color", "Sex and national origin", "Familial status and disability", "Religion and creed"]', 2,
 'The Fair Housing Amendments Act of 1988 added familial status and handicap (disability) to the original protected classes.',
 'fair_housing'),

('Which of the following activities is considered blockbusting under the Fair Housing Act?',
 '["Refusing to show homes in certain neighborhoods", "Inducing homeowners to sell by telling them minorities are moving into the area", "Refusing to lend money in certain areas", "Steering buyers toward certain neighborhoods"]', 1,
 'Blockbusting (panic peddling) is the illegal practice of inducing homeowners to sell by representing that members of a protected class are moving into the area.',
 'fair_housing'),

('Redlining in real estate refers to:',
 '["Highlighting property boundaries on a map", "Denying services in certain geographic areas based on race or ethnicity", "Marking a property as under contract", "Setting a price reduction on a listing"]', 1,
 'Redlining is the illegal practice of denying or limiting financial services or real estate services in certain areas based on racial or ethnic composition.',
 'fair_housing'),

('Which type of housing is generally exempt from the familial status protection under the Fair Housing Act?',
 '["Condominiums", "Housing for older persons (55+ communities meeting HUD criteria)", "Single-family homes listed by brokers", "Multi-family apartment buildings"]', 1,
 'Housing for older persons that meets HUD criteria (55+ communities) may be exempt from the familial status protection under the Fair Housing Act.',
 'fair_housing'),

-- CONTRACT LAW
('For a real estate contract to be legally valid in Florida, it must include which element?',
 '["Witnesses", "Notarization", "Mutual agreement (offer and acceptance)", "A title insurance commitment"]', 2,
 'A valid contract requires mutual agreement (offer and acceptance), consideration, legally competent parties, and a lawful objective.',
 'contract_law'),

('In Florida, a real estate contract signed by a minor is generally considered:',
 '["Void", "Valid and enforceable", "Voidable by the minor", "Voidable by either party"]', 2,
 'Contracts signed by minors are voidable at the option of the minor. The minor may disaffirm the contract upon reaching the age of majority.',
 'contract_law'),

('What does the "time is of the essence" clause in a real estate contract mean?',
 '["The closing must happen as quickly as possible", "All dates and deadlines are strictly binding", "The seller must respond quickly to offers", "The buyer has extra time to complete due diligence"]', 1,
 'A "time is of the essence" clause means that all dates and deadlines in the contract are strictly binding, and failure to meet them may constitute a breach of contract.',
 'contract_law'),

('Under the Florida Statute of Frauds, a real estate contract must be:',
 '["Witnessed by two people", "In writing to be enforceable", "Notarized to be valid", "Filed with the county clerk"]', 1,
 'Florida''s Statute of Frauds requires that contracts for the sale of real property be in writing to be legally enforceable.',
 'contract_law'),

-- DISCLOSURE
('In Florida, what is a seller required to disclose to a buyer?',
 '["All facts that the buyer might find interesting", "All material defects that are not readily observable and affect the value of the property", "Only defects that were caused by the seller", "Nothing — Florida follows caveat emptor"]', 1,
 'Under the Johnson v. Davis ruling, Florida sellers must disclose all known material defects that are not readily observable and that materially affect the value of the property.',
 'disclosure'),

('What is the Florida "stigmatized property" statute regarding disclosure?',
 '["All stigmatized facts must be disclosed", "A seller must disclose if someone died in the home within the past 5 years", "Psychological stigmas such as a death in the home are not required to be disclosed", "Licensees must volunteer stigma information to all buyers"]', 2,
 'Florida law does not require disclosure of psychological stigmas, such as a death in the home, that do not physically affect the property.',
 'disclosure'),

('Which disclosure is required when selling residential property built before 1978 in Florida?',
 '["Asbestos Disclosure", "Lead-Based Paint Disclosure", "Radon Gas Disclosure", "Mold Disclosure"]', 1,
 'Federal law (RESPA) requires a Lead-Based Paint Disclosure for the sale of all residential housing built prior to 1978.',
 'disclosure'),

('Florida law requires that buyers of certain residential properties receive a disclosure about which naturally occurring gas?',
 '["Carbon monoxide", "Methane", "Radon", "Nitrogen dioxide"]', 2,
 'Florida Statute 404.056 requires that buyers of certain residential property receive a disclosure about radon gas and its potential health risks.',
 'disclosure');
